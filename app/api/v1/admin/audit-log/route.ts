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

    const entity = searchParams.get("entity");
    const action = searchParams.get("action");
    const adminId = searchParams.get("adminId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Prisma.multitienda_audit_logWhereInput = {};

    if (entity) where.entity = entity;
    if (action) where.action = action;
    if (adminId) where.adminId = adminId;

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [logs, total] = await Promise.all([
      prisma.multitienda_audit_log.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          admin: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.multitienda_audit_log.count({ where }),
    ]);

    return paginatedResponse(logs, total, pagination);
  });
}
