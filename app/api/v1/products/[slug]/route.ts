import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const product = await prisma.multitienda_product.findUnique({
      where: { slug, active: true },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
    });

    if (!product) {
      return apiError("Producto no encontrado", 404);
    }

    return apiSuccess(product);
  } catch {
    return apiError("Error al obtener producto", 500);
  }
}
