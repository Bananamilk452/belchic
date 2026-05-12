import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockCartItem, mockCartItems, SESSION_ID, USER_ID } from "../../cart/mockData";
import { createMockPrisma } from "../../helpers/mockPrisma";

import type { MockPrisma } from "../../helpers/mockPrisma";
import type { CartWithDetails } from "@/lib/models/cart.model";

type CartItemWithNullableProduct = Omit<CartWithDetails, "variant"> & {
  variant: Omit<CartWithDetails["variant"], "product"> & {
    product: CartWithDetails["variant"]["product"] | null;
  };
};

vi.mock("@/lib/prisma", () => ({
  prisma: createMockPrisma(),
}));

import { prisma } from "@/lib/prisma";
import {
  addToCart,
  getCart,
  mergeGuestCart,
  removeFromCart,
  updateCartItem,
} from "@/lib/services/cart.service";

describe("Cart Service", () => {
  let mockPrisma: MockPrisma;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = prisma as unknown as MockPrisma;
  });

  describe("getCart", () => {
    it("sessionId로 카트를 가져온다", async () => {
      mockPrisma.cart.findMany.mockResolvedValue(mockCartItems);

      const result = await getCart(SESSION_ID);

      expect(mockPrisma.cart.findMany).toHaveBeenCalledWith({
        where: { sessionId: SESSION_ID },
        include: {
          variant: { include: { product: true } },
        },
        orderBy: { createdAt: "asc" },
      });
      expect(result.items).toHaveLength(2);
    });

    it("userId로 카트를 가져온다", async () => {
      mockPrisma.cart.findMany.mockResolvedValue(mockCartItems);

      await getCart(undefined, USER_ID);

      expect(mockPrisma.cart.findMany).toHaveBeenCalledWith({
        where: { userId: USER_ID },
        include: {
          variant: { include: { product: true } },
        },
        orderBy: { createdAt: "asc" },
      });
    });

    it("userId가 있으면 sessionId보다 우선한다", async () => {
      mockPrisma.cart.findMany.mockResolvedValue([]);

      await getCart(SESSION_ID, USER_ID);

      expect(mockPrisma.cart.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: USER_ID },
        }),
      );
    });

    it("둘 다 없으면 에러를 발생시킨다", async () => {
      await expect(getCart()).rejects.toThrow("알 수 없는 오류가 발생했습니다");
    });

    it("product가 null인 항목은 필터링한다", async () => {
      const itemsWithNullProduct: CartItemWithNullableProduct[] = [
        createMockCartItem({ id: "cart-valid" }),
        createMockCartItem({
          id: "cart-invalid",
          variant: { ...mockCartItems[0].variant, product: null },
        }),
      ];
      mockPrisma.cart.findMany.mockResolvedValue(itemsWithNullProduct);

      const result = await getCart(SESSION_ID);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe("cart-valid");
    });

    it("총 가격을 정확히 계산한다", async () => {
      mockPrisma.cart.findMany.mockResolvedValue(mockCartItems);

      const result = await getCart(SESSION_ID);

      // 2 * 50000 + 1 * 55000 = 155000
      expect(result.total).toBe(155000);
    });
  });

  describe("addToCart", () => {
    it("새로운 카트 항목을 생성한다", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(null);
      const newItem = createMockCartItem({ quantity: 3 });
      mockPrisma.cart.create.mockResolvedValue(newItem);

      const result = await addToCart("variant-1", 3, SESSION_ID);

      expect(mockPrisma.cart.create).toHaveBeenCalledWith({
        data: {
          variantId: "variant-1",
          quantity: 3,
          sessionId: SESSION_ID,
          userId: undefined,
        },
        include: {
          variant: { include: { product: true } },
        },
      });
      expect(result.item.quantity).toBe(3);
    });

    it("이미 같은 variant가 있으면 수량을 합친다", async () => {
      const existingItem = createMockCartItem({ quantity: 2 });
      mockPrisma.cart.findFirst.mockResolvedValue(existingItem);
      const updatedItem = createMockCartItem({ quantity: 5 });
      mockPrisma.cart.update.mockResolvedValue(updatedItem);

      await addToCart("variant-1", 3, SESSION_ID);

      expect(mockPrisma.cart.update).toHaveBeenCalledWith({
        where: { id: existingItem.id },
        data: { quantity: 5 },
        include: {
          variant: { include: { product: true } },
        },
      });
    });

    it("수량 합산이 99를 초과하면 99로 제한한다", async () => {
      const existingItem = createMockCartItem({ quantity: 95 });
      mockPrisma.cart.findFirst.mockResolvedValue(existingItem);
      const updatedItem = createMockCartItem({ quantity: 99 });
      mockPrisma.cart.update.mockResolvedValue(updatedItem);

      await addToCart("variant-1", 10, SESSION_ID);

      expect(mockPrisma.cart.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { quantity: 99 },
        }),
      );
    });

    it("product가 null이면 에러를 발생시킨다", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(null);
      const itemWithNullProduct: CartItemWithNullableProduct = createMockCartItem({
        variant: { ...mockCartItems[0].variant, product: null },
      });
      mockPrisma.cart.create.mockResolvedValue(itemWithNullProduct);

      await expect(addToCart("variant-1", 1, SESSION_ID)).rejects.toThrow(
        "상품을 찾을 수 없습니다",
      );
    });

    it("userId로 카트 항목을 생성한다", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(null);
      mockPrisma.cart.create.mockResolvedValue(createMockCartItem());

      await addToCart("variant-1", 1, undefined, USER_ID);

      expect(mockPrisma.cart.findFirst).toHaveBeenCalledWith({
        where: { variantId: "variant-1", userId: USER_ID },
      });
    });
  });

  describe("updateCartItem", () => {
    it("수량을 업데이트한다", async () => {
      const existingItem = createMockCartItem({ quantity: 2 });
      mockPrisma.cart.findFirst.mockResolvedValue(existingItem);
      const updatedItem = createMockCartItem({ quantity: 5 });
      mockPrisma.cart.update.mockResolvedValue(updatedItem);

      const result = await updateCartItem("cart-1", 5, SESSION_ID);

      expect(mockPrisma.cart.update).toHaveBeenCalledWith({
        where: { id: "cart-1" },
        data: { quantity: 5 },
        include: {
          variant: { include: { product: true } },
        },
      });
      expect(result.item.quantity).toBe(5);
    });

    it("항목을 찾을 수 없으면 에러를 발생시킨다", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(null);

      await expect(updateCartItem("nonexistent", 5, SESSION_ID)).rejects.toThrow();
    });

    it("product가 null이면 에러를 발생시킨다", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(createMockCartItem());
      const updatedItem: CartItemWithNullableProduct = createMockCartItem({
        variant: { ...mockCartItems[0].variant, product: null },
      });
      mockPrisma.cart.update.mockResolvedValue(updatedItem);

      await expect(updateCartItem("cart-1", 5, SESSION_ID)).rejects.toThrow(
        "상품을 찾을 수 없습니다",
      );
    });
  });

  describe("removeFromCart", () => {
    it("카트 항목을 삭제한다", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(createMockCartItem());
      mockPrisma.cart.delete.mockResolvedValue(createMockCartItem());

      const result = await removeFromCart("cart-1", SESSION_ID);

      expect(mockPrisma.cart.delete).toHaveBeenCalledWith({
        where: { id: "cart-1" },
      });
      expect(result.success).toBe(true);
    });

    it("항목을 찾을 수 없으면 에러를 발생시킨다", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(null);

      await expect(removeFromCart("nonexistent", SESSION_ID)).rejects.toThrow();
    });

    it("userId로 항목을 찾아 삭제한다", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(createMockCartItem());
      mockPrisma.cart.delete.mockResolvedValue(createMockCartItem());

      await removeFromCart("cart-1", undefined, USER_ID);

      expect(mockPrisma.cart.findFirst).toHaveBeenCalledWith({
        where: { id: "cart-1", userId: USER_ID },
      });
    });
  });

  describe("mergeGuestCart", () => {
    it("비회원 카트를 유저 카트로 이관한다", async () => {
      const guestItem = createMockCartItem({
        id: "guest-1",
        sessionId: SESSION_ID,
        userId: null,
        variantId: "variant-1",
      });
      mockPrisma.cart.findMany.mockResolvedValue([guestItem]);
      mockPrisma.cart.findFirst.mockResolvedValue(null);
      mockPrisma.cart.update.mockResolvedValue({ ...guestItem, userId: USER_ID, sessionId: null });

      const result = await mergeGuestCart(SESSION_ID, USER_ID);

      expect(result.mergedCount).toBe(1);
      expect(mockPrisma.cart.update).toHaveBeenCalledWith({
        where: { id: "guest-1" },
        data: { userId: USER_ID, sessionId: null },
      });
    });

    it("같은 variant가 유저 카트에 있으면 수량을 합산하고 비회원 항목을 삭제한다", async () => {
      const guestItem = createMockCartItem({
        id: "guest-1",
        variantId: "variant-1",
        quantity: 3,
      });
      const userItem = createMockCartItem({
        id: "user-1",
        variantId: "variant-1",
        quantity: 2,
        userId: USER_ID,
        sessionId: null,
      });

      mockPrisma.cart.findMany.mockResolvedValue([guestItem]);
      mockPrisma.cart.findFirst.mockResolvedValue(userItem);

      const result = await mergeGuestCart(SESSION_ID, USER_ID);

      expect(mockPrisma.cart.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { quantity: 5 },
      });
      expect(mockPrisma.cart.delete).toHaveBeenCalledWith({
        where: { id: "guest-1" },
      });
      expect(result.mergedCount).toBe(1);
    });

    it("수량 합산이 99를 초과하면 99로 제한한다", async () => {
      const guestItem = createMockCartItem({
        id: "guest-1",
        variantId: "variant-1",
        quantity: 50,
      });
      const userItem = createMockCartItem({
        id: "user-1",
        variantId: "variant-1",
        quantity: 60,
        userId: USER_ID,
      });

      mockPrisma.cart.findMany.mockResolvedValue([guestItem]);
      mockPrisma.cart.findFirst.mockResolvedValue(userItem);

      await mergeGuestCart(SESSION_ID, USER_ID);

      expect(mockPrisma.cart.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { quantity: 99 },
      });
    });

    it("비회원 카트가 비어있으면 아무것도 하지 않는다", async () => {
      mockPrisma.cart.findMany.mockResolvedValue([]);

      const result = await mergeGuestCart(SESSION_ID, USER_ID);

      expect(result.mergedCount).toBe(0);
      expect(mockPrisma.cart.findFirst).not.toHaveBeenCalled();
    });

    it("여러 비회원 항목을 모두 처리한다", async () => {
      const guestItems = [
        createMockCartItem({ id: "guest-1", variantId: "variant-1", quantity: 2 }),
        createMockCartItem({ id: "guest-2", variantId: "variant-2", quantity: 1 }),
      ];

      mockPrisma.cart.findMany.mockResolvedValue(guestItems);
      mockPrisma.cart.findFirst.mockResolvedValue(null);
      mockPrisma.cart.update.mockResolvedValue({});

      const result = await mergeGuestCart(SESSION_ID, USER_ID);

      expect(result.mergedCount).toBe(2);
    });
  });
});
