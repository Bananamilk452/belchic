import { z } from "zod";
import { ko } from "zod/locales";

import { ERROR_MESSAGES } from "../error-messages";

z.config(ko());

export const GetProductsParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const GetProductByHandleParamsSchema = z.object({
  handle: z.string().min(1, "Handle is required"),
});

export const GetRelatedProductsByHandleParamsSchema = z.object({
  handle: z.string().min(1, "Handle is required"),
  limit: z.number().optional(),
});
