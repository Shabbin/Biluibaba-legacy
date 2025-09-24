import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("super-token")?.value;

    if (!token && request.nextUrl.pathname !== "/") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (token && request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (token) {
      const decodedToken: { exp: number; iat: number; id: string } =
        jwtDecode(token);

      if (Date.now() >= decodedToken.exp * 1000) {
        throw new Error("Token expired");
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);

    if (request.nextUrl.pathname !== "/") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
