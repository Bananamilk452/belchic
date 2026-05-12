import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { ERROR_MESSAGES } from "./error-messages";

import type { ActionPromise } from "@/lib/types/action.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wrapQueryFn<T>(actionFn: () => ActionPromise<T>) {
  return async () => {
    const result = await actionFn();
    if (!result.success) {
      toast.error(result.error);
      throw new Error(result.error);
    }
    return result.data;
  };
}

export async function withAction<T>(fn: () => Promise<T>): ActionPromise<T> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR,
    };
  }
}

export function parsePrice(price: number) {
  return price.toLocaleString("ko-KR", {
    style: "currency",
    currency: "KRW",
  });
}
