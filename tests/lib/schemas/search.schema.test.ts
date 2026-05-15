import { describe, expect, it } from "vitest";

import { searchSchema } from "@/lib/schemas/search.schema";

describe("searchSchema", () => {
  it("유효한 query로 파싱에 성공한다", () => {
    const result = searchSchema.parse({ query: "테스트" });
    expect(result.query).toBe("테스트");
  });

  it("공백만 있는 query는 에러를 발생시킨다", () => {
    expect(() => searchSchema.parse({ query: "   " })).toThrow();
  });

  it("빈 query는 에러를 발생시킨다", () => {
    expect(() => searchSchema.parse({ query: "" })).toThrow();
  });

  it("query가 없으면 에러를 발생시킨다", () => {
    expect(() => searchSchema.parse({})).toThrow();
  });

  it("query의 앞뒤 공백을 제거한다", () => {
    const result = searchSchema.parse({ query: "  검색어  " });
    expect(result.query).toBe("검색어");
  });
});
