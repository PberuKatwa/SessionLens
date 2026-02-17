import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./repositories/sessions.repository";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session_id");

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
                     request.nextUrl.pathname.startsWith("/register");

  if (!sessionCookie) {
    if (isAuthPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const session = await getSession(sessionCookie.value);

    if (session && !isAuthPage) return NextResponse.next();
    if (session && isAuthPage) return NextResponse.redirect(new URL("/dashboard", request.url));

  } catch (error) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session_id");
    return response;
  }
}

// 5. Configure which routes middleware applies to
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
