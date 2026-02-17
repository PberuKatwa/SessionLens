import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './repositories/sessions.repository';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  try {
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/auth') ||
      pathname.includes('favicon.ico')
    ) {
      return NextResponse.next();
    }

    const sessionId = request.cookies.get('session_id')?.value;

    if (!sessionId) {
      if (pathname === '/login') return NextResponse.next();
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const isValid = await getSession(sessionId);

    if (!isValid) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session_id');
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
