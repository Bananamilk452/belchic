import { z } from "zod";
import { ko } from "zod/locales";

import { ERROR_MESSAGES } from "../error-messages";

z.config(ko());

export const ProductSortSchema = z.enum([
  "price_asc",
  "price_desc",
  "name_asc",
  "name_desc",
  "date_asc",
  "date_desc",
]);

export const GetProductsParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
  sort: ProductSortSchema.optional(),
  q: z.string().optional(),
  tag: z.string().optional(),
});

export const GetProductByHandleParamsSchema = z.object({
  handle: z.string().min(1, ERROR_MESSAGES.HANDLE_REQUIRED),
});

export const GetRelatedProductsByHandleParamsSchema = z.object({
  handle: z.string().min(1, ERROR_MESSAGES.HANDLE_REQUIRED),
  limit: z.number().int().min(1).optional(),
});
