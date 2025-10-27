import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  console.log("Middleware hit for path:", pathname);

  // Avoid redirect loop when user is already on the login page
  if (pathname === "/login") {
    return NextResponse.next();
  }

  try {
    const token = request.cookies.get("token")?.value;
    console.log("Token present:", !!token);

    // Build login URL with `from` query param containing the full original path (including query string)
    const loginUrl = new URL("/login", request.url);
    const originalPath = request.nextUrl.pathname + request.nextUrl.search;
    loginUrl.searchParams.set("from", originalPath);

    // Protected routes check
    if (!token) {
      console.log("Redirecting to login - no token, from:", originalPath);
      return NextResponse.redirect(loginUrl);
    }

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // decodedToken.exp may be undefined; guard against that
        if (
          !decodedToken ||
          !decodedToken.exp ||
          Date.now() >= decodedToken.exp * 1000
        ) {
          console.log("Token expired or invalid");
          throw new Error("Token expired or invalid");
        }
      } catch (error) {
        console.log("Token validation failed:", error);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Middleware error:", error);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "from",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-account/:path*",
    "/my-account",
    "/checkout",
    "/adoptions/post",
    "/adoptions/checkout",
    "/vets/checkout",
  ],
};
