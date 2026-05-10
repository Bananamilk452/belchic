import { prisma } from "../prisma";

import type {
  GetProductsParams,
  GetProductsResult,
  GetRelatedProductsByHandleParams,
} from "../models/product.model";

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

export async function getProductByHandle(handle: string) {
  const product = await prisma.product.findFirst({
    where: { handle },
    include: { variants: true },
  });

  if (!product) {
    throw new Error("상품을 찾을 수 없습니다");
  }

  return {
    product,
  };
}

export async function getRelatedProductsByHandle(params: GetRelatedProductsByHandleParams) {
  const { handle, limit = 10 } = params;

  const product = await prisma.product.findFirst({
    where: { handle },
    select: { id: true, type: true, tags: true },
  });

  if (!product) {
    throw new Error("상품을 찾을 수 없습니다");
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      OR: [{ type: product.type }, { tags: { hasSome: product.tags } }],
    },
    take: limit,
    include: { variants: true },
  });

  return {
    products: relatedProducts,
  };
}
