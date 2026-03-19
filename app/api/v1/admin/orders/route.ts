import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPaginationParams,
  paginatedResponse,
  apiError,
  withAdmin,
} from "@/lib/api-helpers";
import { Prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const { searchParams } = new URL(request.url);
    const pagination = getPaginationParams(searchParams);

    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Prisma.multitienda_orderWhereInput = {};

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { contactName: { contains: search, mode: "insensitive" } },
        { contactEmail: { contains: search, mode: "insensitive" } },
        { id: { contains: search, mode: "insensitive" } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.multitienda_order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, sku: true } },
            },
          },
          campaign: { select: { id: true, name: true, code: true } },
        },
      }),
      prisma.multitienda_order.count({ where }),
    ]);

    return paginatedResponse(orders, total, pagination);
  });
}
