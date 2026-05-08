import { prisma } from "../prisma";

import type { GetProductsParams, GetProductsResult } from "../models/product.model";

export async function getProducts(params: GetProductsParams): Promise<GetProductsResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { variants: true },
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
