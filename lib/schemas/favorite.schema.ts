import { z } from "zod";
import { ko } from "zod/locales";

import { ERROR_MESSAGES } from "../error-messages";

z.config(ko());

export const getFavoriteSchema = z.object({
  userId: z.string().min(1, ERROR_MESSAGES.USER_ID_REQUIRED),
});

export const addToFavoriteSchema = z.object({
  productId: z.string().min(1, ERROR_MESSAGES.PRODUCT_ID_REQUIRED),
  userId: z.string().min(1, ERROR_MESSAGES.USER_ID_REQUIRED),
});

export const removeFromFavoriteSchema = z.object({
  productId: z.string().min(1, ERROR_MESSAGES.PRODUCT_ID_REQUIRED),
  userId: z.string().min(1, ERROR_MESSAGES.USER_ID_REQUIRED),
});

export type GetFavoriteValues = z.infer<typeof getFavoriteSchema>;
export type AddToFavoriteValues = z.infer<typeof addToFavoriteSchema>;
export type RemoveFromFavoriteValues = z.infer<typeof removeFromFavoriteSchema>;
