import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("better-auth/cookies", () => ({
  getSessionCookie: vi.fn(),
}));

import { getSessionCookie } from "better-auth/cookies";

import { middleware, config } from "@/middleware";

function createRequest(pathname: string) {
  const url = `http://localhost:3000${pathname}`;
  return new NextRequest(url);
}

describe("middleware", () => {
  it("세션 쿠키가 있고 /sign-in 접근 시 /로 리다이렉트한다", async () => {
    vi.mocked(getSessionCookie).mockReturnValue("session-token");

    const req = createRequest("/sign-in");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/");
  });

  it("세션 쿠키가 있고 /sign-up 접근 시 /로 리다이렉트한다", async () => {
    vi.mocked(getSessionCookie).mockReturnValue("session-token");

    const req = createRequest("/sign-up");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/");
  });

  it("세션 쿠키가 없으면 그대로 통과한다", async () => {
    vi.mocked(getSessionCookie).mockReturnValue(null);

    const req = createRequest("/sign-in");
    const res = await middleware(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).not.toBe(307);
  });

  it("getSessionCookie에서 에러가 나도 통과한다", async () => {
    vi.mocked(getSessionCookie).mockImplementation(() => {
      throw new Error("cookie parse error");
    });

    const req = createRequest("/sign-in");
    const res = await middleware(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).not.toBe(307);
  });

  it("matcher에 /sign-in, /sign-up만 포함한다", () => {
    expect(config.matcher).toEqual(["/sign-in", "/sign-up"]);
  });
});
