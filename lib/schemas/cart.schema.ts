import { z } from "zod";
import { ko } from "zod/locales";

z.config(ko());

export const getCartSchema = z.object({
  sessionId: z.string().optional(),
  userId: z.string().optional(),
});

export const addToCartSchema = z.object({
  variantId: z.string().min(1, "제품 옵션 ID가 필요합니다"),
  quantity: z
    .number()
    .int()
    .min(1, "수량은 최소 1개 이상이어야 합니다")
    .max(99, "수량은 최대 99개까지 가능합니다"),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
});

export const updateCartItemSchema = z.object({
  id: z.string().min(1, "카트 항목 ID가 필요합니다"),
  quantity: z
    .number()
    .int()
    .min(1, "수량은 최소 1개 이상이어야 합니다")
    .max(99, "수량은 최대 99개까지 가능합니다"),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
});

export const removeFromCartSchema = z.object({
  id: z.string().min(1, "카트 항목 ID가 필요합니다"),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
});

export const mergeGuestCartSchema = z.object({
  sessionId: z.string().min(1, "세션 ID가 필요합니다"),
  userId: z.string().min(1, "사용자 ID가 필요합니다"),
});

export type GetCartValues = z.infer<typeof getCartSchema>;
export type AddToCartValues = z.infer<typeof addToCartSchema>;
export type UpdateCartItemValues = z.infer<typeof updateCartItemSchema>;
export type RemoveFromCartValues = z.infer<typeof removeFromCartSchema>;
export type MergeGuestCartValues = z.infer<typeof mergeGuestCartSchema>;
