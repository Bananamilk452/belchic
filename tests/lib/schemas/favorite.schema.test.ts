import { describe, expect, it } from "vitest";

import {
  addToFavoriteSchema,
  getFavoriteSchema,
  removeFromFavoriteSchema,
} from "@/lib/schemas/favorite.schema";

describe("getFavoriteSchema", () => {
  it("유효한 userId로 파싱에 성공한다", () => {
    const result = getFavoriteSchema.parse({ userId: "user-123" });
    expect(result.userId).toBe("user-123");
  });

  it("userId가 없으면 에러를 발생시킨다", () => {
    expect(() => getFavoriteSchema.parse({})).toThrow();
  });

  it("빈 문자열 userId는 에러를 발생시킨다", () => {
    expect(() => getFavoriteSchema.parse({ userId: "" })).toThrow();
  });
});

describe("addToFavoriteSchema", () => {
  it("유효한 productId, userId로 파싱에 성공한다", () => {
    const result = addToFavoriteSchema.parse({
      productId: "product-1",
      userId: "user-123",
    });
    expect(result.productId).toBe("product-1");
    expect(result.userId).toBe("user-123");
  });

  it("productId가 없으면 에러를 발생시킨다", () => {
    expect(() =>
      addToFavoriteSchema.parse({
        userId: "user-123",
      }),
    ).toThrow();
  });

  it("userId가 없으면 에러를 발생시킨다", () => {
    expect(() =>
      addToFavoriteSchema.parse({
        productId: "product-1",
      }),
    ).toThrow();
  });

  it("빈 문자열 productId는 에러를 발생시킨다", () => {
    expect(() =>
      addToFavoriteSchema.parse({
        productId: "",
        userId: "user-123",
      }),
    ).toThrow();
  });

  it("빈 문자열 userId는 에러를 발생시킨다", () => {
    expect(() =>
      addToFavoriteSchema.parse({
        productId: "product-1",
        userId: "",
      }),
    ).toThrow();
  });
});

describe("removeFromFavoriteSchema", () => {
  it("유효한 productId, userId로 파싱에 성공한다", () => {
    const result = removeFromFavoriteSchema.parse({
      productId: "product-1",
      userId: "user-123",
    });
    expect(result.productId).toBe("product-1");
    expect(result.userId).toBe("user-123");
  });

  it("productId가 없으면 에러를 발생시킨다", () => {
    expect(() =>
      removeFromFavoriteSchema.parse({
        userId: "user-123",
      }),
    ).toThrow();
  });

  it("userId가 없으면 에러를 발생시킨다", () => {
    expect(() =>
      removeFromFavoriteSchema.parse({
        productId: "product-1",
      }),
    ).toThrow();
  });

  it("빈 문자열 productId는 에러를 발생시킨다", () => {
    expect(() =>
      removeFromFavoriteSchema.parse({
        productId: "",
        userId: "user-123",
      }),
    ).toThrow();
  });

  it("빈 문자열 userId는 에러를 발생시킨다", () => {
    expect(() =>
      removeFromFavoriteSchema.parse({
        productId: "product-1",
        userId: "",
      }),
    ).toThrow();
  });
});
