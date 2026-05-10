import { Product, Variant } from "../generated/prisma/client";
import {
  GetProductsParamsSchema,
  GetProductByHandleParamsSchema,
  GetRelatedProductsByHandleParamsSchema,
} from "../schemas/product.schema";

import type { z } from "zod";

export type GetProductsParams = z.infer<typeof GetProductsParamsSchema>;
export type GetProductsResult = {
  products: (Product & { variants: Variant[] })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};
export type GetProductByHandleParams = z.infer<typeof GetProductByHandleParamsSchema>;
export type GetProductByHandleResult = {
  product: Product & { variants: Variant[] };
};
export type GetRelatedProductsByHandleParams = z.infer<
  typeof GetRelatedProductsByHandleParamsSchema
>;
export type GetRelatedProductsByHandleResult = {
  products: (Product & { variants: Variant[] })[];
};
