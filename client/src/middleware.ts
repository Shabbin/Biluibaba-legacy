import { NextResponse, NextRequest } from 'next/server';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface DecodedToken extends JwtPayload {
  id?: string;
  name?: string;
  isVerified?: boolean;
  avatar?: string;
  type?: string;
  package?: string;
  packageExpire?: number;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  // Avoid redirect loop when user is already on the login page
  if (pathname === '/login') {
    return NextResponse.next();
  }

  try {
    const token = request.cookies.get('token')?.value;

    // Build login URL with `from` query param containing the full original path
    const loginUrl = new URL('/login', request.url);
    const originalPath = request.nextUrl.pathname + request.nextUrl.search;
    loginUrl.searchParams.set('from', originalPath);

    // Protected routes check
    if (!token) {
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);

      // Validate token expiration
      if (
        !decodedToken ||
        !decodedToken.exp ||
        Date.now() >= decodedToken.exp * 1000
      ) {
        throw new Error('Token expired or invalid');
      }
    } catch {
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'from',
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/my-account/:path*',
    '/my-account',
    '/checkout',
    '/adoptions/post',
    '/adoptions/checkout',
    '/vets/checkout',
  ],
};
