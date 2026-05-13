import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockGetProductsResult } from "../../products/mockData";

vi.mock("@/lib/actions/product.action", () => ({
  getProductsAction: vi.fn(),
  getProductByHandleAction: vi.fn(),
  getRelatedProductsByHandleAction: vi.fn(),
}));

import * as productActions from "@/lib/actions/product.action";
import {
  productByHandleQueryOptions,
  productsQueryOptions,
  relatedProductsByHandleQueryOptions,
} from "@/lib/queries/product.query";

const mockGetProductsAction = vi.mocked(productActions.getProductsAction);
const mockGetProductByHandleAction = vi.mocked(productActions.getProductByHandleAction);

describe("productsQueryOptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("기본값으로 queryKey를 생성한다", () => {
    const options = productsQueryOptions();

    expect(options.queryKey).toEqual(["products", { page: 1, limit: 10 }]);
  });

  it("params를 전달하면 queryKey에 포함한다", () => {
    const options = productsQueryOptions({ page: 3, limit: 20, sort: "price_asc" });

    expect(options.queryKey).toEqual(["products", { page: 3, limit: 20, sort: "price_asc" }]);
  });

  it("queryFn이 getProductsAction을 호출한다", async () => {
    const mockResult = createMockGetProductsResult();
    mockGetProductsAction.mockResolvedValue({ success: true, data: mockResult });

    const options = productsQueryOptions({ page: 1, limit: 10 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (options.queryFn as any)();

    expect(mockGetProductsAction).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(result).toEqual(mockResult);
  });
});

describe("productByHandleQueryOptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queryKey에 handle을 포함한다", () => {
    const options = productByHandleQueryOptions("test-product");

    expect(options.queryKey).toEqual(["product", "test-product"]);
  });

  it("queryFn이 getProductByHandleAction을 호출한다", async () => {
    mockGetProductByHandleAction.mockResolvedValue({
      success: true,
      data: { product: { id: "product-1" } as never },
    });

    const options = productByHandleQueryOptions("test-product");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (options.queryFn as any)();

    expect(mockGetProductByHandleAction).toHaveBeenCalledWith("test-product");
  });
});

describe("relatedProductsByHandleQueryOptions", () => {
  it("queryKey에 handle과 limit을 포함한다", () => {
    const options = relatedProductsByHandleQueryOptions("test-product", 5);

    expect(options.queryKey).toEqual(["relatedProducts", "test-product", 5]);
  });
});
