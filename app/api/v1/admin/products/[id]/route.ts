import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiSuccess,
  apiError,
  withAdmin,
  createAuditLog,
  getClientIp,
} from "@/lib/api-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAdmin(request, async () => {
    const { id } = await params;

    const product = await prisma.multitienda_product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
    });

    if (!product) return apiError("Producto no encontrado", 404);
    return apiSuccess(product);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAdmin(request, async (admin) => {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.multitienda_product.findUnique({ where: { id } });
    if (!existing) return apiError("Producto no encontrado", 404);

    const { variants, images, ...productData } = body;

    const product = await prisma.multitienda_product.update({
      where: { id },
      data: {
        ...productData,
        ...(variants
          ? {
              variants: {
                deleteMany: {},
                create: variants.map(
                  (v: { name: string; type: string; value: string; priceModifier?: number; stock?: number }) => ({
                    name: v.name,
                    type: v.type,
                    value: v.value,
                    priceModifier: v.priceModifier || 0,
                    stock: v.stock || 0,
                  }),
                ),
              },
            }
          : {}),
        ...(images
          ? {
              images: {
                deleteMany: {},
                create: images.map(
                  (img: { url: string; alt?: string; variantId?: string }, i: number) => ({
                    url: img.url,
                    alt: img.alt || null,
                    sortOrder: i,
                    variantId: img.variantId || null,
                  }),
                ),
              },
            }
          : {}),
      },
      include: { category: true, images: true, variants: true },
    });

    await createAuditLog(admin.id, "update", "product", id, body, getClientIp(request));
    return apiSuccess(product);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAdmin(request, async (admin) => {
    const { id } = await params;

    const existing = await prisma.multitienda_product.findUnique({ where: { id } });
    if (!existing) return apiError("Producto no encontrado", 404);

    await prisma.multitienda_product.delete({ where: { id } });
    await createAuditLog(admin.id, "delete", "product", id, { name: existing.name }, getClientIp(request));

    return apiSuccess({ deleted: true });
  });
}
