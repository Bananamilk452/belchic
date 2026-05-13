import { ERROR_MESSAGES } from "../error-messages";
import { prisma } from "../prisma";

import type {
  CartWithDetails,
  GetCartResult,
  AddToCartResult,
  UpdateCartItemResult,
  RemoveFromCartResult,
  MergeGuestCartResult,
} from "../models/cart.model";

export async function getCart(sessionId?: string, userId?: string): Promise<GetCartResult> {
  if (!sessionId && !userId) {
    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }

  const whereClause: {
    userId?: string;
    sessionId?: string;
  } = {};

  if (userId) {
    whereClause.userId = userId;
  } else if (sessionId) {
    whereClause.sessionId = sessionId;
  }

  const items = await prisma.cart.findMany({
    where: whereClause,
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const validItems = items.filter((item) => item.variant.product !== null);

  const total = validItems.reduce((sum, item) => sum + item.quantity * item.variant.price, 0);

  return {
    items: validItems as CartWithDetails[],
    total,
  };
}

export async function addToCart(
  variantId: string,
  quantity: number,
  sessionId?: string,
  userId?: string,
): Promise<AddToCartResult> {
  if (!sessionId && !userId) {
    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }

  const whereClause: {
    variantId: string;
    userId?: string;
    sessionId?: string;
  } = { variantId };
  if (userId) {
    whereClause.userId = userId;
  } else if (sessionId) {
    whereClause.sessionId = sessionId;
  }

  const existingItem = await prisma.cart.findFirst({
    where: whereClause,
  });

  let item;

  if (existingItem) {
    const newQuantity = Math.min(existingItem.quantity + quantity, 99);
    item = await prisma.cart.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });
  } else {
    item = await prisma.cart.create({
      data: {
        variantId,
        quantity,
        sessionId,
        userId,
      },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  if (!item.variant.product) {
    throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  return { item: item as CartWithDetails };
}

export async function updateCartItem(
  id: string,
  quantity: number,
  sessionId?: string,
  userId?: string,
): Promise<UpdateCartItemResult> {
  if (!sessionId && !userId) {
    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }

  const item = await prisma.cart.findFirst({
    where: {
      id,
      ...(userId ? { userId } : { sessionId }),
    },
  });

  if (!item) {
    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }

  const updatedItem = await prisma.cart.update({
    where: { id },
    data: { quantity },
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!updatedItem.variant.product) {
    throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  return { item: updatedItem as CartWithDetails };
}

export async function removeFromCart(
  id: string,
  sessionId?: string,
  userId?: string,
): Promise<RemoveFromCartResult> {
  if (!sessionId && !userId) {
    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }

  const item = await prisma.cart.findFirst({
    where: {
      id,
      ...(userId ? { userId } : { sessionId }),
    },
  });

  if (!item) {
    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }

  await prisma.cart.delete({
    where: { id },
  });

  return { success: true };
}

export async function mergeGuestCart(
  sessionId: string,
  userId: string,
): Promise<MergeGuestCartResult> {
  const guestCartItems = await prisma.cart.findMany({
    where: { sessionId },
  });

  let mergedCount = 0;

  for (const guestItem of guestCartItems) {
    const existingUserItem = await prisma.cart.findFirst({
      where: {
        userId,
        variantId: guestItem.variantId,
      },
    });

    if (existingUserItem) {
      const newQuantity = Math.min(existingUserItem.quantity + guestItem.quantity, 99);
      await prisma.cart.update({
        where: { id: existingUserItem.id },
        data: { quantity: newQuantity },
      });
      await prisma.cart.delete({
        where: { id: guestItem.id },
      });
    } else {
      await prisma.cart.update({
        where: { id: guestItem.id },
        data: {
          userId,
          sessionId: null,
        },
      });
    }
    mergedCount++;
  }

  return { mergedCount };
}
