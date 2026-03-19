import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, cartTotal, productIds, categoryIds, userId } = body;

    if (!code) {
      return apiError("Código de promoción requerido");
    }

    const campaign = await prisma.multitienda_campaign.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!campaign || !campaign.active) {
      return apiError("Código de promoción inválido", 404);
    }

    const now = new Date();
    if (now < campaign.startDate || now > campaign.endDate) {
      return apiError("El código de promoción ha expirado");
    }

    if (campaign.maxUses && campaign.currentUses >= campaign.maxUses) {
      return apiError("El código de promoción ha alcanzado su límite de usos");
    }

    // Check per-user limit
    if (campaign.maxUsesPerUser && userId) {
      const userUses = await prisma.multitienda_campaign_usage.count({
        where: { campaignId: campaign.id, userId },
      });
      if (userUses >= campaign.maxUsesPerUser) {
        return apiError("Ya utilizaste este código el máximo de veces permitido");
      }
    }

    // Check minimum purchase
    if (campaign.minPurchase && cartTotal < campaign.minPurchase) {
      return apiError(
        `El monto mínimo de compra es $${campaign.minPurchase.toLocaleString()}`,
      );
    }

    // Check product/category scope
    if (campaign.productIds.length > 0 && productIds) {
      const hasValidProduct = productIds.some((id: string) =>
        campaign.productIds.includes(id),
      );
      if (!hasValidProduct) {
        return apiError(
          "El código no aplica a los productos de tu carrito",
        );
      }
    }

    if (campaign.categoryIds.length > 0 && categoryIds) {
      const hasValidCategory = categoryIds.some((id: string) =>
        campaign.categoryIds.includes(id),
      );
      if (!hasValidCategory) {
        return apiError(
          "El código no aplica a las categorías de tu carrito",
        );
      }
    }

    // Calculate discount
    let discount = 0;
    if (campaign.type === "percentage") {
      discount = (cartTotal * campaign.value) / 100;
      if (campaign.maxDiscount && discount > campaign.maxDiscount) {
        discount = campaign.maxDiscount;
      }
    } else {
      discount = campaign.value;
    }

    return apiSuccess({
      valid: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        code: campaign.code,
        type: campaign.type,
        value: campaign.value,
      },
      discount: Math.min(discount, cartTotal),
    });
  } catch {
    return apiError("Error al validar código", 500);
  }
}
