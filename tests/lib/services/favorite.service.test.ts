import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  USER_ID,
  PRODUCT_ID,
  mockFavoriteProduct,
  mockFavoriteProduct2,
} from "../../favorite/mockData";
import { createMockPrisma } from "../../helpers/mockPrisma";

import type { MockPrisma } from "../../helpers/mockPrisma";

vi.mock("@/lib/prisma", () => ({
  prisma: createMockPrisma(),
}));

import { prisma } from "@/lib/prisma";
import { addToFavorite, getFavorite, removeFromFavorite } from "@/lib/services/favorite.service";

describe("Favorite Service", () => {
  let mockPrisma: MockPrisma;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = prisma as unknown as MockPrisma;
  });

  describe("getFavorite", () => {
    it("userId로 관심 상품 목록을 가져온다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([mockFavoriteProduct, mockFavoriteProduct2]);

      const result = await getFavorite(USER_ID);

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: { favorites: { some: { userId: USER_ID } } },
        include: { variants: true },
        orderBy: { createdAt: "desc" },
      });
      expect(result.items).toHaveLength(2);
      expect(result.items[0]).toEqual(mockFavoriteProduct);
    });

    it("관심 상품이 없으면 빈 배열을 반환한다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);

      const result = await getFavorite(USER_ID);

      expect(result.items).toHaveLength(0);
    });
  });

  describe("addToFavorite", () => {
    it("새로운 관심 상품을 추가한다", async () => {
      mockPrisma.favorite.findFirst.mockResolvedValue(null);
      mockPrisma.favorite.create.mockResolvedValue({
        id: "fav-1",
        productId: PRODUCT_ID,
        userId: USER_ID,
      });
      mockPrisma.product.findUnique.mockResolvedValue(mockFavoriteProduct);

      const result = await addToFavorite(PRODUCT_ID, USER_ID);

      expect(mockPrisma.favorite.create).toHaveBeenCalledWith({
        data: { productId: PRODUCT_ID, userId: USER_ID },
      });
      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID },
        include: { variants: true },
      });
      expect(result.item).toEqual(mockFavoriteProduct);
    });

    it("이미 존재하는 관심 상품이면 기존 항목을 반환한다", async () => {
      mockPrisma.favorite.findFirst.mockResolvedValue({
        id: "fav-1",
        productId: PRODUCT_ID,
        userId: USER_ID,
      });
      mockPrisma.product.findUnique.mockResolvedValue(mockFavoriteProduct);

      const result = await addToFavorite(PRODUCT_ID, USER_ID);

      expect(mockPrisma.favorite.create).not.toHaveBeenCalled();
      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID },
        include: { variants: true },
      });
      expect(result.item).toEqual(mockFavoriteProduct);
    });
  });

  describe("removeFromFavorite", () => {
    it("관심 상품을 삭제한다", async () => {
      mockPrisma.favorite.findFirst.mockResolvedValue({
        id: "fav-1",
        productId: PRODUCT_ID,
        userId: USER_ID,
      });
      mockPrisma.favorite.delete.mockResolvedValue({ id: "fav-1" });

      const result = await removeFromFavorite(PRODUCT_ID, USER_ID);

      expect(mockPrisma.favorite.delete).toHaveBeenCalledWith({
        where: { id: "fav-1" },
      });
      expect(result.success).toBe(true);
    });

    it("항목을 찾을 수 없으면 에러를 발생시킨다", async () => {
      mockPrisma.favorite.findFirst.mockResolvedValue(null);

      await expect(removeFromFavorite(PRODUCT_ID, USER_ID)).rejects.toThrow(
        "알 수 없는 오류가 발생했습니다",
      );
    });
  });
});
