import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPaginationParams,
  paginatedResponse,
  apiSuccess,
  apiError,
  withAdmin,
  createAuditLog,
  getClientIp,
} from "@/lib/api-helpers";
import { Prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const { searchParams } = new URL(request.url);
    const pagination = getPaginationParams(searchParams);
    const active = searchParams.get("active");

    const where: Prisma.multitienda_campaignWhereInput = {};
    if (active !== null && active !== undefined) where.active = active === "true";

    const [campaigns, total] = await Promise.all([
      prisma.multitienda_campaign.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          _count: { select: { usages: true, orders: true } },
        },
      }),
      prisma.multitienda_campaign.count({ where }),
    ]);

    return paginatedResponse(campaigns, total, pagination);
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (admin) => {
    try {
      const body = await request.json();
      const {
        name,
        code,
        description,
        type,
        value,
        minPurchase,
        maxDiscount,
        maxUses,
        maxUsesPerUser,
        startDate,
        endDate,
        active,
        categoryIds,
        productIds,
      } = body;

      if (!name || !code || !type || value === undefined || !startDate || !endDate) {
        return apiError("Campos requeridos: name, code, type, value, startDate, endDate");
      }

      if (!["percentage", "fixed"].includes(type)) {
        return apiError("Tipo debe ser 'percentage' o 'fixed'");
      }

      const campaign = await prisma.multitienda_campaign.create({
        data: {
          name,
          code: code.toUpperCase(),
          description: description || null,
          type,
          value,
          minPurchase: minPurchase || null,
          maxDiscount: maxDiscount || null,
          maxUses: maxUses || null,
          maxUsesPerUser: maxUsesPerUser || null,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          active: active !== false,
          categoryIds: categoryIds || [],
          productIds: productIds || [],
        },
      });

      await createAuditLog(admin.id, "create", "campaign", campaign.id, body, getClientIp(request));
      return apiSuccess(campaign, 201);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return apiError("El código de campaña ya existe");
      }
      return apiError("Error al crear campaña", 500);
    }
  });
}
