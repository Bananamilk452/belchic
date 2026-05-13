import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const sessionCookie = getSessionCookie(request);

    if (sessionCookie && ["/sign-in", "/sign-up"].includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    // 쿠키 파싱 실패 시 통과
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up"],
};
