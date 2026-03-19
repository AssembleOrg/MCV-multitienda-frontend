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

    const campaign = await prisma.multitienda_campaign.findUnique({
      where: { id },
      include: {
        usages: { orderBy: { usedAt: "desc" }, take: 50 },
        _count: { select: { usages: true, orders: true } },
      },
    });

    if (!campaign) return apiError("Campaña no encontrada", 404);
    return apiSuccess(campaign);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAdmin(request, async (admin) => {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.multitienda_campaign.findUnique({ where: { id } });
    if (!existing) return apiError("Campaña no encontrada", 404);

    const { startDate, endDate, code, ...rest } = body;

    const campaign = await prisma.multitienda_campaign.update({
      where: { id },
      data: {
        ...rest,
        ...(code ? { code: code.toUpperCase() } : {}),
        ...(startDate ? { startDate: new Date(startDate) } : {}),
        ...(endDate ? { endDate: new Date(endDate) } : {}),
      },
    });

    await createAuditLog(admin.id, "update", "campaign", id, body, getClientIp(request));
    return apiSuccess(campaign);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAdmin(request, async (admin) => {
    const { id } = await params;

    const existing = await prisma.multitienda_campaign.findUnique({ where: { id } });
    if (!existing) return apiError("Campaña no encontrada", 404);

    await prisma.multitienda_campaign.delete({ where: { id } });
    await createAuditLog(admin.id, "delete", "campaign", id, { name: existing.name }, getClientIp(request));

    return apiSuccess({ deleted: true });
  });
}
