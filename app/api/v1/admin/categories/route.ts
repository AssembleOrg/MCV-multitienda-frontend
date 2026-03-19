import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiSuccess,
  apiError,
  withAdmin,
  createAuditLog,
  getClientIp,
} from "@/lib/api-helpers";
import { Prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const categories = await prisma.multitienda_category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return apiSuccess(categories);
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (admin) => {
    try {
      const body = await request.json();
      const { name, slug, description, icon, image, sortOrder, active } = body;

      if (!name || !slug) {
        return apiError("Nombre y slug son requeridos");
      }

      const category = await prisma.multitienda_category.create({
        data: {
          name,
          slug,
          description: description || null,
          icon: icon || null,
          image: image || null,
          sortOrder: sortOrder || 0,
          active: active !== false,
        },
      });

      await createAuditLog(admin.id, "create", "category", category.id, body, getClientIp(request));
      return apiSuccess(category, 201);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return apiError("El slug ya existe");
      }
      return apiError("Error al crear categoría", 500);
    }
  });
}
