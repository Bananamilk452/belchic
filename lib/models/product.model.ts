import { Product, Variant } from "../generated/prisma/client";
import {
  GetProductsParamsSchema,
  GetProductByHandleParamsSchema,
  GetRelatedProductsByHandleParamsSchema,
  ProductSortSchema,
} from "../schemas/product.schema";

import type { z } from "zod";

export const SORT_OPTIONS = [
  { value: "date_desc", label: "최신순" },
  { value: "date_asc", label: "오래된순" },
  { value: "price_asc", label: "가격 낮은 순" },
  { value: "price_desc", label: "가격 높은 순" },
  { value: "name_asc", label: "알파벳 순, A-Z" },
  { value: "name_desc", label: "알파벳 순, Z-A" },
] as const;

export const SORT_VALUES = SORT_OPTIONS.map((o) => o.value);

export type ProductSort = z.infer<typeof ProductSortSchema>;
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
