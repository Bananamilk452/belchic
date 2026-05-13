import { ERROR_MESSAGES } from "../error-messages";
import { prisma } from "../prisma";

import type {
  GetProductsParams,
  GetProductsResult,
  GetRelatedProductsByHandleParams,
  ProductSort,
} from "../models/product.model";

const sortOrderMap = {
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  name_asc: { title: "asc" },
  name_desc: { title: "desc" },
  date_asc: { createdAt: "asc" },
  date_desc: { createdAt: "desc" },
} as const satisfies Record<ProductSort, Record<string, "asc" | "desc">>;

export async function getProducts(params: GetProductsParams): Promise<GetProductsResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const skip = (page - 1) * limit;
  const orderBy = params.sort ? sortOrderMap[params.sort] : { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      orderBy,
      include: {
        variants: true,
      },
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
    include: {
      variants: true,
    },
  });

  if (!product) {
    throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  return { product };
}

export async function getRelatedProductsByHandle(params: GetRelatedProductsByHandleParams) {
  const { handle, limit = 10 } = params;

  const product = await prisma.product.findFirst({
    where: { handle },
    select: { id: true, type: true, tags: true },
  });

  if (!product) {
    throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      OR: [{ type: product.type }, { tags: { hasSome: product.tags } }],
    },
    take: limit,
    include: {
      variants: true,
    },
  });

  return { products: relatedProducts };
}
