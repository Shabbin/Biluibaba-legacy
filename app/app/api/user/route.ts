import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("app-token")?.value;

  if (token) {
    try {
      const user = jwtDecode(token);
      return NextResponse.json({ user });
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  return NextResponse.json({ error: "No token found" }, { status: 401 });
}
