import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const promos = await prisma.multitienda_promo.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });

    return apiSuccess(promos);
  } catch {
    return apiError("Error al obtener promos", 500);
  }
}
