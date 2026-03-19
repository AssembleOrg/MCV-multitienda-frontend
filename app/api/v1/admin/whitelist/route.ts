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
    const emails = await prisma.multitienda_whitelisted_email.findMany({
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(emails);
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (admin) => {
    const body = await request.json();
    const { email, role, note, active } = body;

    if (!email) return apiError("Email es requerido");

    const existing = await prisma.multitienda_whitelisted_email.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) return apiError("Este email ya está en la whitelist");

    const entry = await prisma.multitienda_whitelisted_email.create({
      data: {
        email: email.toLowerCase(),
        role: role || "customer",
        note: note || null,
        active: active !== false,
      },
    });

    await createAuditLog(
      admin.id,
      "create",
      "whitelist",
      entry.id,
      { email: entry.email, role: entry.role },
      getClientIp(request),
    );

    return apiSuccess(entry, 201);
  });
}
