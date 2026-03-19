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

    const existing = await prisma.multitienda_whitelisted_email.findUnique({
      where: { id },
    });
    if (!existing) return apiError("Email no encontrado", 404);

    const entry = await prisma.multitienda_whitelisted_email.update({
      where: { id },
      data: body,
    });

    await createAuditLog(
      admin.id,
      "update",
      "whitelist",
      id,
      body,
      getClientIp(request),
    );

    return apiSuccess(entry);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAdmin(request, async (admin) => {
    const { id } = await params;

    const existing = await prisma.multitienda_whitelisted_email.findUnique({
      where: { id },
    });
    if (!existing) return apiError("Email no encontrado", 404);

    await prisma.multitienda_whitelisted_email.delete({ where: { id } });

    await createAuditLog(
      admin.id,
      "delete",
      "whitelist",
      id,
      { email: existing.email },
      getClientIp(request),
    );

    return apiSuccess({ deleted: true });
  });
}
