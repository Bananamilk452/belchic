import { describe, expect, it } from "vitest";

import { signInSchema, signUpSchema } from "@/lib/schemas/auth.schema";

describe("signInSchema", () => {
  it("유효한 값으로 파싱에 성공한다", () => {
    const result = signInSchema.parse({
      email: "test@test.com",
      password: "password123",
    });
    expect(result.email).toBe("test@test.com");
    expect(result.password).toBe("password123");
  });

  it("email이 없으면 에러를 발생시킨다", () => {
    expect(() =>
      signInSchema.parse({
        password: "password123",
      }),
    ).toThrow();
  });

  it("빈 email은 에러를 발생시킨다", () => {
    expect(() =>
      signInSchema.parse({
        email: "",
        password: "password123",
      }),
    ).toThrow();
  });

  it("유효하지 않은 email 형식은 에러를 발생시킨다", () => {
    expect(() =>
      signInSchema.parse({
        email: "invalid-email",
        password: "password123",
      }),
    ).toThrow();
  });

  it("password가 없으면 에러를 발생시킨다", () => {
    expect(() =>
      signInSchema.parse({
        email: "test@test.com",
      }),
    ).toThrow();
  });

  it("email의 앞뒤 공백을 제거한다", () => {
    const result = signInSchema.parse({
      email: "  test@test.com  ",
      password: "password123",
    });
    expect(result.email).toBe("test@test.com");
  });
});

describe("signUpSchema", () => {
  it("유효한 값으로 파싱에 성공한다", () => {
    const result = signUpSchema.parse({
      name: "테스터",
      email: "test@test.com",
      password: "password123",
      passwordConfirm: "password123",
    });
    expect(result.name).toBe("테스터");
    expect(result.email).toBe("test@test.com");
    expect(result.password).toBe("password123");
    expect(result.passwordConfirm).toBe("password123");
  });

  it("name이 없으면 에러를 발생시킨다", () => {
    expect(() =>
      signUpSchema.parse({
        email: "test@test.com",
        password: "password123",
        passwordConfirm: "password123",
      }),
    ).toThrow();
  });

  it("빈 name은 에러를 발생시킨다", () => {
    expect(() =>
      signUpSchema.parse({
        name: "",
        email: "test@test.com",
        password: "password123",
        passwordConfirm: "password123",
      }),
    ).toThrow();
  });

  it("email이 없으면 에러를 발생시킨다", () => {
    expect(() =>
      signUpSchema.parse({
        name: "테스터",
        password: "password123",
        passwordConfirm: "password123",
      }),
    ).toThrow();
  });

  it("유효하지 않은 email 형식은 에러를 발생시킨다", () => {
    expect(() =>
      signUpSchema.parse({
        name: "테스터",
        email: "invalid-email",
        password: "password123",
        passwordConfirm: "password123",
      }),
    ).toThrow();
  });

  it("password가 8자 미만이면 에러를 발생시킨다", () => {
    expect(() =>
      signUpSchema.parse({
        name: "테스터",
        email: "test@test.com",
        password: "1234567",
        passwordConfirm: "1234567",
      }),
    ).toThrow();
  });

  it("password가 8자이면 유효하다", () => {
    const result = signUpSchema.parse({
      name: "테스터",
      email: "test@test.com",
      password: "12345678",
      passwordConfirm: "12345678",
    });
    expect(result.password).toBe("12345678");
  });

  it("passwordConfirm이 없으면 에러를 발생시킨다", () => {
    expect(() =>
      signUpSchema.parse({
        name: "테스터",
        email: "test@test.com",
        password: "password123",
      }),
    ).toThrow();
  });

  it("password와 passwordConfirm이 다르면 에러를 발생시킨다", () => {
    expect(() =>
      signUpSchema.parse({
        name: "테스터",
        email: "test@test.com",
        password: "password123",
        passwordConfirm: "password456",
      }),
    ).toThrow();
  });

  it("name의 앞뒤 공백을 제거한다", () => {
    const result = signUpSchema.parse({
      name: "  테스터  ",
      email: "test@test.com",
      password: "password123",
      passwordConfirm: "password123",
    });
    expect(result.name).toBe("테스터");
  });
});
