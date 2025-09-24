import { parse } from "cookie";
import { jwtDecode } from "jwt-decode";

export async function GET(request) {
  const cookies = parse(request.headers.get("cookie") || "");
  const token = cookies.token;

  if (token) {
    try {
      const decoded = jwtDecode(token);
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
