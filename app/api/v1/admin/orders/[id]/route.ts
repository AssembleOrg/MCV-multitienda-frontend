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

    const order = await prisma.multitienda_order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            product: true,
            variants: { include: { variant: true } },
          },
        },
        campaign: true,
      },
    });

    if (!order) return apiError("Orden no encontrada", 404);
    return apiSuccess(order);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAdmin(request, async (admin) => {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const existing = await prisma.multitienda_order.findUnique({ where: { id } });
    if (!existing) return apiError("Orden no encontrada", 404);

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return apiError(`Estado inválido. Debe ser: ${validStatuses.join(", ")}`);
    }

    const order = await prisma.multitienda_order.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    });

    await createAuditLog(
      admin.id,
      "update",
      "order",
      id,
      { previousStatus: existing.status, newStatus: status, notes },
      getClientIp(request),
    );

    return apiSuccess(order);
  });
}
