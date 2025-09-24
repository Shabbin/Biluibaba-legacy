import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  console.log("Middleware hit for path:", pathname);

  try {
    const token = request.cookies.get("token")?.value;
    console.log("Token present:", token);

    // Protected routes check
    if (!token) {
      console.log("Redirecting to login - no token");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (Date.now() >= decodedToken.exp * 1000) {
          console.log("Token expired");
          throw new Error("Token expired");
        }
      } catch (error) {
        console.log("Token validation failed:", error);
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-account/:path*",
    "/my-account",
    "/checkout",
    "/adoptions/checkout",
  ],
};
