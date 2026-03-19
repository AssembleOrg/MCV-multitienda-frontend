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

    const existing = await prisma.multitienda_category.findUnique({ where: { id } });
    if (!existing) return apiError("Categoría no encontrada", 404);

    const category = await prisma.multitienda_category.update({
      where: { id },
      data: body,
    });

    await createAuditLog(admin.id, "update", "category", id, body, getClientIp(request));
    return apiSuccess(category);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAdmin(request, async (admin) => {
    const { id } = await params;

    const existing = await prisma.multitienda_category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!existing) return apiError("Categoría no encontrada", 404);

    if (existing._count.products > 0) {
      return apiError("No se puede eliminar una categoría con productos asociados");
    }

    await prisma.multitienda_category.delete({ where: { id } });
    await createAuditLog(admin.id, "delete", "category", id, { name: existing.name }, getClientIp(request));

    return apiSuccess({ deleted: true });
  });
}
