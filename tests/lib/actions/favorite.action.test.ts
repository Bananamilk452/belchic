import { beforeEach, describe, expect, it, vi } from "vitest";

import { USER_ID, PRODUCT_ID, mockFavoriteProduct } from "../../favorite/mockData";

vi.mock("@/lib/services/favorite.service", () => ({
  getFavorite: vi.fn(),
  addToFavorite: vi.fn(),
  removeFromFavorite: vi.fn(),
}));

const mockSession = {
  user: { id: USER_ID, email: "test@test.com", name: "테스터" },
  session: { id: "session-1" },
};

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(null),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

import {
  getFavoriteAction,
  addToFavoriteAction,
  removeFromFavoriteAction,
} from "@/lib/actions/favorite.action";
import { auth } from "@/lib/auth";
import * as favoriteService from "@/lib/services/favorite.service";

const mockGetFavorite = vi.mocked(favoriteService.getFavorite);
const mockAddToFavorite = vi.mocked(favoriteService.addToFavorite);
const mockRemoveFromFavorite = vi.mocked(favoriteService.removeFromFavorite);
const mockGetSession = vi.mocked(auth.api.getSession);

describe("Favorite Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFavoriteAction", () => {
    it("세션이 있으면 관심 상품을 가져온다", async () => {
      mockGetSession.mockResolvedValue(mockSession as never);
      mockGetFavorite.mockResolvedValue({ items: [mockFavoriteProduct] });

      const result = await getFavoriteAction();

      expect(mockGetFavorite).toHaveBeenCalledWith(USER_ID);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(1);
      }
    });

    it("세션이 없으면 에러를 반환한다", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await getFavoriteAction();

      expect(result.success).toBe(false);
      expect(mockGetFavorite).not.toHaveBeenCalled();
    });
  });

  describe("addToFavoriteAction", () => {
    it("관심 상품을 추가한다", async () => {
      mockGetSession.mockResolvedValue(mockSession as never);
      mockAddToFavorite.mockResolvedValue({ item: mockFavoriteProduct });

      const result = await addToFavoriteAction(PRODUCT_ID);

      expect(mockAddToFavorite).toHaveBeenCalledWith(PRODUCT_ID, USER_ID);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.item).toEqual(mockFavoriteProduct);
      }
    });

    it("세션이 없으면 에러를 반환한다", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await addToFavoriteAction(PRODUCT_ID);

      expect(result.success).toBe(false);
      expect(mockAddToFavorite).not.toHaveBeenCalled();
    });
  });

  describe("removeFromFavoriteAction", () => {
    it("관심 상품을 제거한다", async () => {
      mockGetSession.mockResolvedValue(mockSession as never);
      mockRemoveFromFavorite.mockResolvedValue({ success: true });

      const result = await removeFromFavoriteAction(PRODUCT_ID);

      expect(mockRemoveFromFavorite).toHaveBeenCalledWith(PRODUCT_ID, USER_ID);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.success).toBe(true);
      }
    });

    it("세션이 없으면 에러를 반환한다", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await removeFromFavoriteAction(PRODUCT_ID);

      expect(result.success).toBe(false);
      expect(mockRemoveFromFavorite).not.toHaveBeenCalled();
    });
  });
});
