"use server";

import { headers } from "next/headers";

import { auth } from "../auth";
import { ERROR_MESSAGES } from "../error-messages";
import {
  addToFavoriteSchema,
  getFavoriteSchema,
  removeFromFavoriteSchema,
} from "../schemas/favorite.schema";
import { addToFavorite, getFavorite, removeFromFavorite } from "../services/favorite.service";
import { withAction } from "../utils";

import type {
  AddToFavoriteResult,
  GetFavoriteResult,
  RemoveFromFavoriteResult,
} from "../models/favorite.model";
import type { ActionPromise } from "../types/action.types";

async function getUserId(): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }

  return session.user.id;
}

export async function getFavoriteAction(): ActionPromise<GetFavoriteResult> {
  return withAction(async () => {
    const userId = await getUserId();

    const validatedParams = getFavoriteSchema.parse({ userId });

    return getFavorite(validatedParams.userId);
  });
}

export async function addToFavoriteAction(productId: string): ActionPromise<AddToFavoriteResult> {
  return withAction(async () => {
    const userId = await getUserId();

    const validatedParams = addToFavoriteSchema.parse({
      productId,
      userId,
    });

    return addToFavorite(validatedParams.productId, validatedParams.userId);
  });
}

export async function removeFromFavoriteAction(
  productId: string,
): ActionPromise<RemoveFromFavoriteResult> {
  return withAction(async () => {
    const userId = await getUserId();

    const validatedParams = removeFromFavoriteSchema.parse({
      productId,
      userId,
    });

    return removeFromFavorite(validatedParams.productId, validatedParams.userId);
  });
}
