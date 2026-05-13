import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockGetProductsResult, mockProductsWithVariants } from "../../products/mockData";

vi.mock("@/lib/services/product.service", () => ({
  getProducts: vi.fn(),
  getProductByHandle: vi.fn(),
  getRelatedProductsByHandle: vi.fn(),
}));

import {
  getProductByHandleAction,
  getProductsAction,
  getRelatedProductsByHandleAction,
} from "@/lib/actions/product.action";
import * as productService from "@/lib/services/product.service";

const mockGetProducts = vi.mocked(productService.getProducts);
const mockGetProductByHandle = vi.mocked(productService.getProductByHandle);
const mockGetRelatedProductsByHandle = vi.mocked(productService.getRelatedProductsByHandle);

describe("Product Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProductsAction", () => {
    it("기본값으로 상품 목록을 가져온다", async () => {
      const mockResult = createMockGetProductsResult();
      mockGetProducts.mockResolvedValue(mockResult);

      const result = await getProductsAction();

      expect(mockGetProducts).toHaveBeenCalledWith({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.products).toHaveLength(2);
      }
    });

    it("page, limit, sort를 전달한다", async () => {
      const mockResult = createMockGetProductsResult();
      mockGetProducts.mockResolvedValue(mockResult);

      const result = await getProductsAction({ page: 2, limit: 20, sort: "price_asc" });

      expect(mockGetProducts).toHaveBeenCalledWith({
        page: 2,
        limit: 20,
        sort: "price_asc",
      });
      expect(result.success).toBe(true);
    });

    it("서비스가 에러를 던지면 실패 결과를 반환한다", async () => {
      mockGetProducts.mockRejectedValue(new Error("서버 오류"));

      const result = await getProductsAction();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("서버 오류");
      }
    });

    it("유효하지 않은 sort 값은 schema 검증에 실패한다", async () => {
      const result = await getProductsAction({ sort: "invalid" as never });

      expect(result.success).toBe(false);
      expect(mockGetProducts).not.toHaveBeenCalled();
    });
  });

  describe("getProductByHandleAction", () => {
    it("핸들로 상품을 조회한다", async () => {
      mockGetProductByHandle.mockResolvedValue({
        product: mockProductsWithVariants[0],
      });

      const result = await getProductByHandleAction("test-product");

      expect(mockGetProductByHandle).toHaveBeenCalledWith("test-product");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.product.handle).toBe("test-product");
      }
    });

    it("URI 인코딩된 핸들을 디코딩한다", async () => {
      mockGetProductByHandle.mockResolvedValue({
        product: mockProductsWithVariants[0],
      });

      await getProductByHandleAction("test%20product");

      expect(mockGetProductByHandle).toHaveBeenCalledWith("test product");
    });

    it("서비스가 에러를 던지면 실패 결과를 반환한다", async () => {
      mockGetProductByHandle.mockRejectedValue(new Error("상품을 찾을 수 없습니다"));

      const result = await getProductByHandleAction("nonexistent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("상품을 찾을 수 없습니다");
      }
    });
  });

  describe("getRelatedProductsByHandleAction", () => {
    it("핸들로 연관 상품을 조회한다", async () => {
      mockGetRelatedProductsByHandle.mockResolvedValue({
        products: [mockProductsWithVariants[1] ?? mockProductsWithVariants[0]],
      });

      const result = await getRelatedProductsByHandleAction({
        handle: "test-product",
        limit: 5,
      });

      expect(mockGetRelatedProductsByHandle).toHaveBeenCalledWith({
        handle: "test-product",
        limit: 5,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.products).toHaveLength(1);
      }
    });

    it("limit 기본값을 적용한다", async () => {
      mockGetRelatedProductsByHandle.mockResolvedValue({ products: [] });

      await getRelatedProductsByHandleAction({ handle: "test-product" });

      expect(mockGetRelatedProductsByHandle).toHaveBeenCalledWith({
        handle: "test-product",
        limit: 10,
      });
    });

    it("URI 인코딩된 핸들을 디코딩한다", async () => {
      mockGetRelatedProductsByHandle.mockResolvedValue({ products: [] });

      await getRelatedProductsByHandleAction({ handle: "test%20product" });

      expect(mockGetRelatedProductsByHandle).toHaveBeenCalledWith({
        handle: "test product",
        limit: 10,
      });
    });

    it("서비스가 에러를 던지면 실패 결과를 반환한다", async () => {
      mockGetRelatedProductsByHandle.mockRejectedValue(new Error("상품을 찾을 수 없습니다"));

      const result = await getRelatedProductsByHandleAction({
        handle: "nonexistent",
      });

      expect(result.success).toBe(false);
    });
  });
});
