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

    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const active = searchParams.get("active");

    const where: Prisma.multitienda_productWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) where.categoryId = category;
    if (active !== null && active !== undefined) where.active = active === "true";

    const [products, total] = await Promise.all([
      prisma.multitienda_product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
          _count: { select: { orderItems: true } },
        },
      }),
      prisma.multitienda_product.count({ where }),
    ]);

    return paginatedResponse(products, total, pagination);
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (admin) => {
    try {
      const body = await request.json();
      const {
        name,
        slug,
        description,
        price,
        originalPrice,
        stock,
        sku,
        featured,
        active,
        categoryId,
        variants,
        images,
      } = body;

      if (!name || !slug || !description || price === undefined || !sku || !categoryId) {
        return apiError("Campos requeridos: name, slug, description, price, sku, categoryId");
      }

      const product = await prisma.multitienda_product.create({
        data: {
          name,
          slug,
          description,
          price,
          originalPrice: originalPrice || null,
          stock: stock || 0,
          sku,
          featured: featured || false,
          active: active !== false,
          categoryId,
          variants: variants
            ? {
                create: variants.map(
                  (v: { name: string; type: string; value: string; priceModifier?: number; stock?: number }) => ({
                    name: v.name,
                    type: v.type,
                    value: v.value,
                    priceModifier: v.priceModifier || 0,
                    stock: v.stock || 0,
                  }),
                ),
              }
            : undefined,
          images: images
            ? {
                create: images.map(
                  (img: { url: string; alt?: string; variantId?: string }, i: number) => ({
                    url: img.url,
                    alt: img.alt || null,
                    sortOrder: i,
                    variantId: img.variantId || null,
                  }),
                ),
              }
            : undefined,
        },
        include: { category: true, images: true, variants: true },
      });

      await createAuditLog(admin.id, "create", "product", product.id, body, getClientIp(request));

      return apiSuccess(product, 201);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return apiError("El slug o SKU ya existe");
      }
      return apiError("Error al crear producto", 500);
    }
  });
}
