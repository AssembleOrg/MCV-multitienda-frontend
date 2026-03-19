import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const store = await prisma.multitienda_store.findFirst();

    if (!store) {
      return apiSuccess({
        name: "MCV Multitienda",
        description: "Tu tienda online de confianza",
        phone: null,
        email: null,
        currency: "ARS",
      });
    }

    return apiSuccess(store);
  } catch {
    return apiError("Error al obtener configuración de tienda", 500);
  }
}
