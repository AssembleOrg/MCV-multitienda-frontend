import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiSuccess,
  apiError,
  withAdmin,
  createAuditLog,
  getClientIp,
} from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const promos = await prisma.multitienda_promo.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return apiSuccess(promos);
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (admin) => {
    const body = await request.json();
    const { text, link, active, sortOrder } = body;

    if (!text) return apiError("El texto es requerido");

    const promo = await prisma.multitienda_promo.create({
      data: {
        text,
        link: link || null,
        active: active !== false,
        sortOrder: sortOrder || 0,
      },
    });

    await createAuditLog(admin.id, "create", "promo", promo.id, body, getClientIp(request));
    return apiSuccess(promo, 201);
  });
}
