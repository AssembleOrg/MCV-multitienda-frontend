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
    const store = await prisma.multitienda_store.findFirst();
    return apiSuccess(store);
  });
}

export async function PUT(request: NextRequest) {
  return withAdmin(request, async (admin) => {
    const body = await request.json();

    let store = await prisma.multitienda_store.findFirst();

    if (store) {
      store = await prisma.multitienda_store.update({
        where: { id: store.id },
        data: body,
      });
      await createAuditLog(admin.id, "update", "store", store.id, body, getClientIp(request));
    } else {
      store = await prisma.multitienda_store.create({ data: body });
      await createAuditLog(admin.id, "create", "store", store.id, body, getClientIp(request));
    }

    return apiSuccess(store);
  });
}
