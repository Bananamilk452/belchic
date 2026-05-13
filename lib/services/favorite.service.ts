import { ERROR_MESSAGES } from "../error-messages";
import { prisma } from "../prisma";

import type {
  FavoriteProduct,
  GetFavoriteResult,
  AddToFavoriteResult,
  RemoveFromFavoriteResult,
} from "../models/favorite.model";

export async function getFavorite(userId: string): Promise<GetFavoriteResult> {
  const items = await prisma.product.findMany({
    where: { favorites: { some: { userId } } },
    include: {
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return { items };
}

export async function addToFavorite(
  productId: string,
  userId: string,
): Promise<AddToFavoriteResult> {
  const existingFavorite = await prisma.favorite.findFirst({
    where: { productId, userId },
  });

  if (existingFavorite) {
    const item = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    return { item: item as FavoriteProduct };
  }

  await prisma.favorite.create({
    data: { productId, userId },
  });

  const item = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  return { item: item as FavoriteProduct };
}

export async function removeFromFavorite(
  productId: string,
  userId: string,
): Promise<RemoveFromFavoriteResult> {
  const item = await prisma.favorite.findFirst({
    where: { productId, userId },
  });

  if (!item) {
    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }

  await prisma.favorite.delete({ where: { id: item.id } });

  return { success: true };
}
