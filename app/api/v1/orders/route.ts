import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      shippingAddress,
      contactInfo,
      campaignCode,
      notes,
    } = body;

    if (!items || items.length === 0) {
      return apiError("El carrito está vacío");
    }

    if (!contactInfo?.name || !contactInfo?.email || !contactInfo?.phone) {
      return apiError("Datos de contacto incompletos");
    }

    // Get authenticated user (optional — guest checkout allowed)
    const user = await getAuthUser(request);

    // Validate products and calculate totals
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.multitienda_product.findMany({
      where: { id: { in: productIds }, active: true },
      include: { variants: true },
    });

    if (products.length !== productIds.length) {
      return apiError("Algunos productos no están disponibles");
    }

    let subtotal = 0;
    const orderItems: {
      productId: string;
      quantity: number;
      price: number;
      variantIds: string[];
    }[] = [];

    for (const item of items as {
      productId: string;
      quantity: number;
      variantIds?: string[];
    }[]) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return apiError(`Producto ${item.productId} no encontrado`);

      if (product.stock < item.quantity) {
        return apiError(`Stock insuficiente para "${product.name}"`);
      }

      let price = product.price;
      // Apply variant price modifiers
      if (item.variantIds?.length) {
        for (const vid of item.variantIds) {
          const variant = product.variants.find((v) => v.id === vid);
          if (variant?.priceModifier) {
            price += variant.priceModifier;
          }
        }
      }

      subtotal += price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price,
        variantIds: item.variantIds || [],
      });
    }

    // Apply campaign discount
    let discount = 0;
    let campaignId: string | null = null;

    if (campaignCode) {
      const campaign = await prisma.multitienda_campaign.findUnique({
        where: { code: campaignCode.toUpperCase() },
      });

      if (campaign && campaign.active) {
        const now = new Date();
        if (now >= campaign.startDate && now <= campaign.endDate) {
          if (!campaign.maxUses || campaign.currentUses < campaign.maxUses) {
            if (campaign.type === "percentage") {
              discount = (subtotal * campaign.value) / 100;
              if (campaign.maxDiscount && discount > campaign.maxDiscount) {
                discount = campaign.maxDiscount;
              }
            } else {
              discount = campaign.value;
            }
            discount = Math.min(discount, subtotal);
            campaignId = campaign.id;
          }
        }
      }
    }

    const shippingCost = 0; // Free shipping for now
    const total = subtotal - discount + shippingCost;

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.multitienda_order.create({
        data: {
          userId: user?.id || null,
          status: "pending",
          subtotal,
          discount,
          shippingCost,
          total,
          campaignId,
          contactName: contactInfo.name,
          contactEmail: contactInfo.email,
          contactPhone: contactInfo.phone,
          shippingStreet: shippingAddress?.street || null,
          shippingCity: shippingAddress?.city || null,
          shippingState: shippingAddress?.state || null,
          shippingZip: shippingAddress?.zipCode || null,
          shippingCountry: shippingAddress?.country || "Argentina",
          notes: notes || null,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              variants: item.variantIds.length > 0
                ? { create: item.variantIds.map((vid) => ({ variantId: vid })) }
                : undefined,
            })),
          },
        },
        include: {
          items: { include: { product: { select: { name: true, sku: true } } } },
        },
      });

      // Decrease stock
      for (const item of orderItems) {
        await tx.multitienda_product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Track campaign usage
      if (campaignId) {
        await tx.multitienda_campaign.update({
          where: { id: campaignId },
          data: { currentUses: { increment: 1 } },
        });
        await tx.multitienda_campaign_usage.create({
          data: {
            campaignId,
            userId: user?.id || null,
            orderId: newOrder.id,
          },
        });
      }

      return newOrder;
    });

    return apiSuccess(order, 201);
  } catch {
    return apiError("Error al crear el pedido", 500);
  }
}
