import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockPrisma } from "../../helpers/mockPrisma";
import { mockProduct, mockProduct2, mockProductsWithVariants } from "../../products/mockData";

import type { MockPrisma } from "../../helpers/mockPrisma";

vi.mock("@/lib/prisma", () => ({
  prisma: createMockPrisma(),
}));

import { prisma } from "@/lib/prisma";
import {
  getProductByHandle,
  getProducts,
  getRelatedProductsByHandle,
} from "@/lib/services/product.service";

describe("Product Service", () => {
  let mockPrisma: MockPrisma;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = prisma as unknown as MockPrisma;
  });

  describe("getProducts", () => {
    it("기본값으로 상품 목록을 가져온다", async () => {
      mockPrisma.product.findMany.mockResolvedValue(mockProductsWithVariants);
      mockPrisma.product.count.mockResolvedValue(20);

      const result = await getProducts({});

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { variants: true },
        where: {},
      });
      expect(mockPrisma.product.count).toHaveBeenCalledWith({
        where: {},
      });
      expect(result.products).toHaveLength(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(20);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(false);
    });

    it("page가 2면 skip을 계산한다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(25);

      await getProducts({ page: 2, limit: 10 });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it("마지막 페이지면 hasNext는 false다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([mockProduct]);
      mockPrisma.product.count.mockResolvedValue(25);

      const result = await getProducts({ page: 3, limit: 10 });

      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.hasPrev).toBe(true);
    });

    it("price_asc 정렬을 적용한다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await getProducts({ sort: "price_asc" });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { price: "asc" },
        }),
      );
    });

    it("price_desc 정렬을 적용한다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await getProducts({ sort: "price_desc" });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { price: "desc" },
        }),
      );
    });

    it("name_asc 정렬을 적용한다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await getProducts({ sort: "name_asc" });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { title: "asc" },
        }),
      );
    });

    it("name_desc 정렬을 적용한다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await getProducts({ sort: "name_desc" });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { title: "desc" },
        }),
      );
    });

    it("date_asc 정렬을 적용한다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await getProducts({ sort: "date_asc" });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "asc" },
        }),
      );
    });

    it("date_desc 정렬을 적용한다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await getProducts({ sort: "date_desc" });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        }),
      );
    });

    it("limit을 커스텀값으로 적용한다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await getProducts({ limit: 50 });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 50,
        }),
      );
    });

    it("totalPages를 정확히 계산한다", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(33);

      const result = await getProducts({ limit: 10 });

      expect(result.pagination.totalPages).toBe(4);
    });
  });

  describe("getProductByHandle", () => {
    it("핸들로 상품을 조회한다", async () => {
      mockPrisma.product.findFirst.mockResolvedValue(mockProduct);

      const result = await getProductByHandle("test-product");

      expect(mockPrisma.product.findFirst).toHaveBeenCalledWith({
        where: { handle: "test-product" },
        include: { variants: true },
      });
      expect(result.product.handle).toBe("test-product");
    });

    it("상품이 없으면 에러를 발생시킨다", async () => {
      mockPrisma.product.findFirst.mockResolvedValue(null);

      await expect(getProductByHandle("nonexistent")).rejects.toThrow("상품을 찾을 수 없습니다");
    });
  });

  describe("getRelatedProductsByHandle", () => {
    it("핸들로 상품을 조회하고 연관 상품을 반환한다", async () => {
      const foundProduct = {
        id: "product-1",
        type: "의류",
        tags: ["신상품"],
      };
      mockPrisma.product.findFirst.mockResolvedValue(foundProduct);
      mockPrisma.product.findMany.mockResolvedValue([mockProduct2]);

      const result = await getRelatedProductsByHandle({ handle: "test-product" });

      expect(mockPrisma.product.findFirst).toHaveBeenCalledWith({
        where: { handle: "test-product" },
        select: { id: true, type: true, tags: true },
      });
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: {
          id: { not: "product-1" },
          OR: [{ type: "의류" }, { tags: { hasSome: ["신상품"] } }],
        },
        take: 10,
        include: { variants: true },
      });
      expect(result.products).toHaveLength(1);
    });

    it("limit을 커스텀값으로 적용한다", async () => {
      mockPrisma.product.findFirst.mockResolvedValue({
        id: "product-1",
        type: "의류",
        tags: [],
      });
      mockPrisma.product.findMany.mockResolvedValue([]);

      await getRelatedProductsByHandle({ handle: "test-product", limit: 5 });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        }),
      );
    });

    it("상품이 없으면 에러를 발생시킨다", async () => {
      mockPrisma.product.findFirst.mockResolvedValue(null);

      await expect(getRelatedProductsByHandle({ handle: "nonexistent" })).rejects.toThrow(
        "상품을 찾을 수 없습니다",
      );
    });
  });
});
