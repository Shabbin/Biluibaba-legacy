import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { decode } from "punycode";

export async function middleware(request: NextRequest) {
  console.log("hit");
  try {
    const token = request.cookies.get("app-token")?.value;

    if (!token && request.nextUrl.pathname !== "/") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (token && request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (token) {
      const decodedToken: {
        exp: number;
        iat: number;
        id: string;
        type: string;
      } = jwtDecode(token);

      if (Date.now() >= decodedToken.exp * 1000) {
        throw new Error("Token expired");
      }

      if (request.nextUrl.pathname.startsWith("/dashboard/vet")) {
        if (decodedToken.type !== "vet")
          return NextResponse.redirect(new URL("/dashboard", request.url));
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
