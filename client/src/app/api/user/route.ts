import { NextRequest } from "next/server";
import { parse } from "cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";

export async function GET(request: NextRequest): Promise<Response> {
  const cookies = parse(request.headers.get("cookie") || "");
  const token = cookies.token;

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return new Response(JSON.stringify(decoded), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response("Invalid token", { status: 400 });
    }
  } else {
    return new Response("Not logged in", { status: 200 });
  }
}
