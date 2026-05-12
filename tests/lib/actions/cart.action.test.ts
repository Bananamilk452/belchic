import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockCartItem, mockCartItems, SESSION_ID, USER_ID } from "../../cart/mockData";
import { createMockCookieStore } from "../../helpers/mockCookies";

const mockCookieStore = createMockCookieStore(SESSION_ID);

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

const mockGetCart = vi.fn();
const mockAddToCart = vi.fn();
const mockUpdateCartItem = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockMergeGuestCart = vi.fn();

vi.mock("@/lib/services/cart.service", () => ({
  getCart: mockGetCart,
  addToCart: mockAddToCart,
  updateCartItem: mockUpdateCartItem,
  removeFromCart: mockRemoveFromCart,
  mergeGuestCart: mockMergeGuestCart,
}));

import {
  getCartAction,
  addToCartAction,
  updateCartItemAction,
  removeFromCartAction,
  mergeGuestCartToUserAction,
  clearCartSessionIdAction,
} from "@/lib/actions/cart.action";

describe("Cart Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookieStore.get.mockReturnValue({ name: "cart_session_id", value: SESSION_ID });
  });

  describe("getCartAction", () => {
    it("쿠키에서 sessionId를 읽어 카트를 가져온다", async () => {
      mockGetCart.mockResolvedValue({ items: mockCartItems, total: 155000 });

      const result = await getCartAction();

      expect(mockGetCart).toHaveBeenCalledWith(SESSION_ID, undefined);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(2);
      }
    });

    it("sessionId가 없어도 에러가 발생하지 않는다", async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      mockGetCart.mockResolvedValue({ items: [], total: 0 });

      const result = await getCartAction();

      expect(result.success).toBe(true);
      expect(mockGetCart).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe("addToCartAction", () => {
    it("카트에 제품을 추가한다", async () => {
      const newItem = createMockCartItem({ quantity: 1 });
      mockAddToCart.mockResolvedValue({ item: newItem });

      const result = await addToCartAction("variant-1", 1);

      expect(result.success).toBe(true);
      expect(mockAddToCart).toHaveBeenCalledWith("variant-1", 1, expect.any(String), undefined);
    });

    it("quantity 기본값은 1이다", async () => {
      mockAddToCart.mockResolvedValue({ item: createMockCartItem() });

      await addToCartAction("variant-1");

      expect(mockAddToCart).toHaveBeenCalledWith("variant-1", 1, expect.any(String), undefined);
    });

    it("쿠키에 sessionId가 없으면 새로 생성한다", async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      mockAddToCart.mockResolvedValue({ item: createMockCartItem() });

      await addToCartAction("variant-1", 1);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "cart_session_id",
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          sameSite: "lax",
        }),
      );
    });
  });

  describe("updateCartItemAction", () => {
    it("카트 항목의 수량을 업데이트한다", async () => {
      const updatedItem = createMockCartItem({ quantity: 5 });
      mockUpdateCartItem.mockResolvedValue({ item: updatedItem });

      const result = await updateCartItemAction("cart-1", 5);

      expect(result.success).toBe(true);
      expect(mockUpdateCartItem).toHaveBeenCalledWith("cart-1", 5, SESSION_ID, undefined);
    });
  });

  describe("removeFromCartAction", () => {
    it("카트 항목을 삭제한다", async () => {
      mockRemoveFromCart.mockResolvedValue({ success: true });

      const result = await removeFromCartAction("cart-1");

      expect(result.success).toBe(true);
      expect(mockRemoveFromCart).toHaveBeenCalledWith("cart-1", SESSION_ID, undefined);
    });
  });

  describe("mergeGuestCartToUserAction", () => {
    it("비회원 카트를 유저 카트로 병합한다", async () => {
      mockMergeGuestCart.mockResolvedValue({ mergedCount: 3 });

      const result = await mergeGuestCartToUserAction(SESSION_ID, USER_ID);

      expect(result.success).toBe(true);
      expect(mockMergeGuestCart).toHaveBeenCalledWith(SESSION_ID, USER_ID);
    });
  });

  describe("clearCartSessionIdAction", () => {
    it("카트 세션 쿠키를 삭제한다", async () => {
      const result = await clearCartSessionIdAction();

      expect(mockCookieStore.delete).toHaveBeenCalledWith("cart_session_id");
      expect(result.success).toBe(true);
    });
  });
});
