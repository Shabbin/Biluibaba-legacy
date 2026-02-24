import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("app-token")?.value;

    if (!token && request.nextUrl.pathname !== "/" && !request.nextUrl.pathname.startsWith("/register") && !request.nextUrl.pathname.startsWith("/forgot-password") && !request.nextUrl.pathname.startsWith("/reset-password")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (token) {
      const decodedToken: {
        exp: number;
        iat: number;
        id: string;
        type: string;
        status?: string;
      } = jwtDecode(token);

      if (Date.now() >= decodedToken.exp * 1000) {
        throw new Error("Token expired");
      }

      // If on login page and has valid token, redirect appropriately
      if (request.nextUrl.pathname === "/") {
        // Unapproved vendors go to pending-approval page
        if (decodedToken.type === "vendor" && decodedToken.status !== "approved") {
          return NextResponse.redirect(new URL("/dashboard/pending-approval", request.url));
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Block unapproved vendors from all dashboard routes except pending-approval
      if (
        decodedToken.type === "vendor" &&
        decodedToken.status !== "approved" &&
        request.nextUrl.pathname.startsWith("/dashboard") &&
        !request.nextUrl.pathname.startsWith("/dashboard/pending-approval")
      ) {
        return NextResponse.redirect(new URL("/dashboard/pending-approval", request.url));
      }

      // Approved vendors should not see the pending-approval page
      if (
        decodedToken.type === "vendor" &&
        decodedToken.status === "approved" &&
        request.nextUrl.pathname.startsWith("/dashboard/pending-approval")
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (request.nextUrl.pathname.startsWith("/dashboard/vet")) {
        if (decodedToken.type !== "vet")
          return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);

    if (request.nextUrl.pathname !== "/" && !request.nextUrl.pathname.startsWith("/register")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
