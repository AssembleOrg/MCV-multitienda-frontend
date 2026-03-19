import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiSuccess,
  apiError,
  withAdmin,
  createAuditLog,
  getClientIp,
} from "@/lib/api-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAdmin(request, async (admin) => {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.multitienda_promo.findUnique({ where: { id } });
    if (!existing) return apiError("Promo no encontrada", 404);

    const promo = await prisma.multitienda_promo.update({
      where: { id },
      data: body,
    });

    await createAuditLog(admin.id, "update", "promo", id, body, getClientIp(request));
    return apiSuccess(promo);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAdmin(request, async (admin) => {
    const { id } = await params;

    const existing = await prisma.multitienda_promo.findUnique({ where: { id } });
    if (!existing) return apiError("Promo no encontrada", 404);

    await prisma.multitienda_promo.delete({ where: { id } });
    await createAuditLog(admin.id, "delete", "promo", id, { text: existing.text }, getClientIp(request));

    return apiSuccess({ deleted: true });
  });
}
