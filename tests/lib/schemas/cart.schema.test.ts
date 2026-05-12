import { describe, expect, it } from "vitest";

import {
  addToCartSchema,
  getCartSchema,
  mergeGuestCartSchema,
  removeFromCartSchema,
  updateCartItemSchema,
} from "@/lib/schemas/cart.schema";

describe("getCartSchema", () => {
  it("sessionId와 userId 모두 선택값이다", () => {
    expect(getCartSchema.parse({}).sessionId).toBeUndefined();
    expect(getCartSchema.parse({}).userId).toBeUndefined();
  });

  it("sessionId만 전달할 수 있다", () => {
    const result = getCartSchema.parse({ sessionId: "session-123" });
    expect(result.sessionId).toBe("session-123");
    expect(result.userId).toBeUndefined();
  });

  it("userId만 전달할 수 있다", () => {
    const result = getCartSchema.parse({ userId: "user-456" });
    expect(result.userId).toBe("user-456");
    expect(result.sessionId).toBeUndefined();
  });

  it("빈 객체도 유효하다", () => {
    expect(() => getCartSchema.parse({})).not.toThrow();
  });
});

describe("addToCartSchema", () => {
  it("유효한 값으로 파싱에 성공한다", () => {
    const result = addToCartSchema.parse({
      variantId: "variant-1",
      quantity: 3,
      sessionId: "session-123",
    });
    expect(result.variantId).toBe("variant-1");
    expect(result.quantity).toBe(3);
  });

  it("variantId가 없으면 에러를 발생시킨다", () => {
    expect(() =>
      addToCartSchema.parse({
        quantity: 1,
      }),
    ).toThrow();
  });

  it("빈 문자열 variantId는 에러를 발생시킨다", () => {
    expect(() =>
      addToCartSchema.parse({
        variantId: "",
        quantity: 1,
      }),
    ).toThrow();
  });

  it("quantity가 0이면 에러를 발생시킨다", () => {
    expect(() =>
      addToCartSchema.parse({
        variantId: "variant-1",
        quantity: 0,
      }),
    ).toThrow();
  });

  it("quantity가 음수면 에러를 발생시킨다", () => {
    expect(() =>
      addToCartSchema.parse({
        variantId: "variant-1",
        quantity: -1,
      }),
    ).toThrow();
  });

  it("quantity가 99 초과면 에러를 발생시킨다", () => {
    expect(() =>
      addToCartSchema.parse({
        variantId: "variant-1",
        quantity: 100,
      }),
    ).toThrow();
  });

  it("quantity가 99이면 유효하다", () => {
    const result = addToCartSchema.parse({
      variantId: "variant-1",
      quantity: 99,
    });
    expect(result.quantity).toBe(99);
  });

  it("quantity가 소수면 에러를 발생시킨다", () => {
    expect(() =>
      addToCartSchema.parse({
        variantId: "variant-1",
        quantity: 1.5,
      }),
    ).toThrow();
  });

  it("sessionId와 userId는 선택값이다", () => {
    const result = addToCartSchema.parse({
      variantId: "variant-1",
      quantity: 1,
    });
    expect(result.sessionId).toBeUndefined();
    expect(result.userId).toBeUndefined();
  });
});

describe("updateCartItemSchema", () => {
  it("유효한 값으로 파싱에 성공한다", () => {
    const result = updateCartItemSchema.parse({
      id: "cart-1",
      quantity: 5,
      sessionId: "session-123",
    });
    expect(result.id).toBe("cart-1");
    expect(result.quantity).toBe(5);
  });

  it("id가 없으면 에러를 발생시킨다", () => {
    expect(() =>
      updateCartItemSchema.parse({
        quantity: 1,
      }),
    ).toThrow();
  });

  it("빈 문자열 id는 에러를 발생시킨다", () => {
    expect(() =>
      updateCartItemSchema.parse({
        id: "",
        quantity: 1,
      }),
    ).toThrow();
  });

  it("quantity가 1 미만이면 에러를 발생시킨다", () => {
    expect(() =>
      updateCartItemSchema.parse({
        id: "cart-1",
        quantity: 0,
      }),
    ).toThrow();
  });

  it("quantity가 99 초과면 에러를 발생시킨다", () => {
    expect(() =>
      updateCartItemSchema.parse({
        id: "cart-1",
        quantity: 100,
      }),
    ).toThrow();
  });
});

describe("removeFromCartSchema", () => {
  it("유효한 값으로 파싱에 성공한다", () => {
    const result = removeFromCartSchema.parse({
      id: "cart-1",
      sessionId: "session-123",
    });
    expect(result.id).toBe("cart-1");
  });

  it("id가 없으면 에러를 발생시킨다", () => {
    expect(() =>
      removeFromCartSchema.parse({
        sessionId: "session-123",
      }),
    ).toThrow();
  });

  it("빈 문자열 id는 에러를 발생시킨다", () => {
    expect(() =>
      removeFromCartSchema.parse({
        id: "",
      }),
    ).toThrow();
  });

  it("sessionId와 userId는 선택값이다", () => {
    const result = removeFromCartSchema.parse({ id: "cart-1" });
    expect(result.sessionId).toBeUndefined();
    expect(result.userId).toBeUndefined();
  });
});

describe("mergeGuestCartSchema", () => {
  it("유효한 값으로 파싱에 성공한다", () => {
    const result = mergeGuestCartSchema.parse({
      sessionId: "session-123",
      userId: "user-456",
    });
    expect(result.sessionId).toBe("session-123");
    expect(result.userId).toBe("user-456");
  });

  it("sessionId가 없으면 에러를 발생시킨다", () => {
    expect(() =>
      mergeGuestCartSchema.parse({
        userId: "user-456",
      }),
    ).toThrow();
  });

  it("userId가 없으면 에러를 발생시킨다", () => {
    expect(() =>
      mergeGuestCartSchema.parse({
        sessionId: "session-123",
      }),
    ).toThrow();
  });

  it("빈 문자열은 에러를 발생시킨다", () => {
    expect(() =>
      mergeGuestCartSchema.parse({
        sessionId: "",
        userId: "user-456",
      }),
    ).toThrow();

    expect(() =>
      mergeGuestCartSchema.parse({
        sessionId: "session-123",
        userId: "",
      }),
    ).toThrow();
  });
});
