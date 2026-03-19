import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma } from "./prisma";
import { requireAdmin } from "./auth";

// ============================================
// Standard API Response
// ============================================
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// ============================================
// Pagination
// ============================================
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function getPaginationParams(
  searchParams: URLSearchParams,
): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10)),
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams,
) {
  return apiSuccess({
    items: data,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  });
}

// ============================================
// Audit Log Helper
// ============================================
export async function createAuditLog(
  adminId: string,
  action: "create" | "update" | "delete",
  entity: string,
  entityId: string,
  changes?: object,
  ip?: string,
) {
  await prisma.multitienda_audit_log.create({
    data: {
      adminId,
      action,
      entity,
      entityId,
      changes: changes ? (changes as Prisma.InputJsonValue) : Prisma.JsonNull,
      ip: ip || null,
    },
  });
}

// ============================================
// Admin Guard Wrapper
// ============================================
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function withAdmin(
  request: NextRequest,
  handler: (
    admin: { id: string; email: string; name: string; role: string },
  ) => Promise<NextResponse>,
) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("No autorizado", 401);
  }
  return handler(admin);
}
