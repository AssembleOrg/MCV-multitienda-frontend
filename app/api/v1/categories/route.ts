import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const categories = await prisma.multitienda_category.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: { where: { active: true } } } },
      },
    });

    return apiSuccess(categories);
  } catch {
    return apiError("Error al obtener categorías", 500);
  }
}
