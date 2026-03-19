import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaginationParams, paginatedResponse, apiError } from "@/lib/api-helpers";
import { Prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pagination = getPaginationParams(searchParams);

    // Filters
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "newest";

    const where: Prisma.multitienda_productWhereInput = {
      active: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Sort
    let orderBy: Prisma.multitienda_productOrderByWithRelationInput = { createdAt: "desc" };
    switch (sortBy) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "name":
        orderBy = { name: "asc" };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.multitienda_product.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
        },
      }),
      prisma.multitienda_product.count({ where }),
    ]);

    return paginatedResponse(products, total, pagination);
  } catch {
    return apiError("Error al obtener productos", 500);
  }
}
