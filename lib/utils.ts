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

export function getPaginationItems(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "ellipsis", total];
  }

  if (current >= total - 2) {
    return [1, "ellipsis", total - 3, total - 2, total - 1, total];
  }

  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

export function buildHref(targetPage: number, sort: string, defaultSort?: string) {
  const params = new URLSearchParams();
  params.set("page", String(targetPage));
  if (sort !== defaultSort) {
    params.set("sort", sort);
  }
  return `?${params.toString()}`;
}
