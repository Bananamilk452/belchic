"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";

import { auth } from "../auth";
import {
  addToCartSchema,
  getCartSchema,
  mergeGuestCartSchema,
  removeFromCartSchema,
  updateCartItemSchema,
} from "../schemas/cart.schema";
import {
  addToCart,
  getCart,
  mergeGuestCart,
  removeFromCart,
  updateCartItem,
} from "../services/cart.service";
import { withAction } from "../utils";

import type {
  AddToCartResult,
  GetCartResult,
  MergeGuestCartResult,
  RemoveFromCartResult,
  UpdateCartItemResult,
} from "../models/cart.model";
import type { ActionPromise } from "../types/action.types";

const CART_SESSION_ID = "cart_session_id";

async function getUserId(): Promise<string | undefined> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user.id;
}

async function getCartSessionId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_SESSION_ID)?.value;
}

async function setCartSessionId(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_SESSION_ID, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
}

async function generateCartSessionId(): Promise<string> {
  return crypto.randomUUID();
}

async function getOrGenerateSessionId(): Promise<string | undefined> {
  const existingId = await getCartSessionId();
  if (existingId) {
    return existingId;
  }

  const newId = await generateCartSessionId();
  await setCartSessionId(newId);
  return newId;
}

export async function getCartAction(): ActionPromise<GetCartResult> {
  return withAction(async () => {
    const userId = await getUserId();
    const sessionId = userId ? undefined : await getCartSessionId();

    const validatedParams = getCartSchema.parse({
      sessionId,
      userId,
    });

    return getCart(validatedParams.sessionId, validatedParams.userId);
  });
}

export async function addToCartAction(
  variantId: string,
  quantity: number = 1,
): ActionPromise<AddToCartResult> {
  return withAction(async () => {
    const userId = await getUserId();
    const sessionId = userId ? undefined : await getOrGenerateSessionId();

    const validatedParams = addToCartSchema.parse({
      variantId,
      quantity,
      sessionId,
      userId,
    });

    return addToCart(
      validatedParams.variantId,
      validatedParams.quantity,
      validatedParams.sessionId,
      validatedParams.userId,
    );
  });
}

export async function updateCartItemAction(
  id: string,
  quantity: number,
): ActionPromise<UpdateCartItemResult> {
  return withAction(async () => {
    const userId = await getUserId();
    const sessionId = userId ? undefined : await getCartSessionId();

    const validatedParams = updateCartItemSchema.parse({
      id,
      quantity,
      sessionId,
      userId,
    });

    return updateCartItem(
      validatedParams.id,
      validatedParams.quantity,
      validatedParams.sessionId,
      validatedParams.userId,
    );
  });
}

export async function removeFromCartAction(id: string): ActionPromise<RemoveFromCartResult> {
  return withAction(async () => {
    const userId = await getUserId();
    const sessionId = userId ? undefined : await getCartSessionId();

    const validatedParams = removeFromCartSchema.parse({
      id,
      sessionId,
      userId,
    });

    return removeFromCart(validatedParams.id, validatedParams.sessionId, validatedParams.userId);
  });
}

export async function mergeGuestCartToUserAction(
  sessionId: string,
  userId: string,
): ActionPromise<MergeGuestCartResult> {
  return withAction(async () => {
    const validatedParams = mergeGuestCartSchema.parse({
      sessionId,
      userId,
    });

    return mergeGuestCart(validatedParams.sessionId, validatedParams.userId);
  });
}

export async function clearCartSessionIdAction(): ActionPromise<{ success: boolean }> {
  return withAction(async () => {
    const cookieStore = await cookies();
    cookieStore.delete(CART_SESSION_ID);
    return { success: true };
  });
}
