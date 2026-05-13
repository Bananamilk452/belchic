import { describe, expect, it } from "vitest";

import {
  GetProductByHandleParamsSchema,
  GetProductsParamsSchema,
  GetRelatedProductsByHandleParamsSchema,
} from "@/lib/schemas/product.schema";

describe("GetProductsParamsSchema", () => {
  it("빈 객체도 유효하다", () => {
    expect(() => GetProductsParamsSchema.parse({})).not.toThrow();
  });

  it("page만 전달할 수 있다", () => {
    const result = GetProductsParamsSchema.parse({ page: 3 });
    expect(result.page).toBe(3);
  });

  it("limit만 전달할 수 있다", () => {
    const result = GetProductsParamsSchema.parse({ limit: 20 });
    expect(result.limit).toBe(20);
  });

  it("sort만 전달할 수 있다", () => {
    const result = GetProductsParamsSchema.parse({ sort: "price_asc" });
    expect(result.sort).toBe("price_asc");
  });

  it("모든 값을 함께 전달할 수 있다", () => {
    const result = GetProductsParamsSchema.parse({
      page: 2,
      limit: 15,
      sort: "name_desc",
    });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(15);
    expect(result.sort).toBe("name_desc");
  });

  it("page가 문자열이면 에러를 발생시킨다", () => {
    expect(() => GetProductsParamsSchema.parse({ page: "abc" })).toThrow();
  });

  it("page가 0이면 에러를 발생시킨다", () => {
    expect(() => GetProductsParamsSchema.parse({ page: 0 })).toThrow();
  });

  it("page가 음수이면 에러를 발생시킨다", () => {
    expect(() => GetProductsParamsSchema.parse({ page: -1 })).toThrow();
  });

  it("limit이 0이면 에러를 발생시킨다", () => {
    expect(() => GetProductsParamsSchema.parse({ limit: 0 })).toThrow();
  });

  it("limit이 문자열이면 에러를 발생시킨다", () => {
    expect(() => GetProductsParamsSchema.parse({ limit: "abc" })).toThrow();
  });

  it("sort가 유효하지 않은 값이면 에러를 발생시킨다", () => {
    expect(() => GetProductsParamsSchema.parse({ sort: "invalid" })).toThrow();
  });

  it("정의되지 않은 키는 무시된다", () => {
    const result = GetProductsParamsSchema.parse({ page: 1, extra: "value" } as never);
    expect(result).not.toHaveProperty("extra");
    expect(result.page).toBe(1);
  });
});

describe("GetProductByHandleParamsSchema", () => {
  it("유효한 handle로 파싱에 성공한다", () => {
    const result = GetProductByHandleParamsSchema.parse({ handle: "test-product" });
    expect(result.handle).toBe("test-product");
  });

  it("handle이 빈 문자열이면 에러를 발생시킨다", () => {
    expect(() => GetProductByHandleParamsSchema.parse({ handle: "" })).toThrow();
  });

  it("handle이 없으면 에러를 발생시킨다", () => {
    expect(() => GetProductByHandleParamsSchema.parse({})).toThrow();
  });
});

describe("GetRelatedProductsByHandleParamsSchema", () => {
  it("유효한 handle로 파싱에 성공한다", () => {
    const result = GetRelatedProductsByHandleParamsSchema.parse({ handle: "test-product" });
    expect(result.handle).toBe("test-product");
  });

  it("limit을 함께 전달할 수 있다", () => {
    const result = GetRelatedProductsByHandleParamsSchema.parse({
      handle: "test-product",
      limit: 5,
    });
    expect(result.handle).toBe("test-product");
    expect(result.limit).toBe(5);
  });

  it("limit이 0이면 에러를 발생시킨다", () => {
    expect(() =>
      GetRelatedProductsByHandleParamsSchema.parse({ handle: "test", limit: 0 }),
    ).toThrow();
  });

  it("handle이 빈 문자열이면 에러를 발생시킨다", () => {
    expect(() => GetRelatedProductsByHandleParamsSchema.parse({ handle: "" })).toThrow();
  });

  it("handle이 없으면 에러를 발생시킨다", () => {
    expect(() => GetRelatedProductsByHandleParamsSchema.parse({})).toThrow();
  });
});
