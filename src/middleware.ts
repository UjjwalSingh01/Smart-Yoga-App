import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function middleware(req: Request) {
  const url = new URL(req.url);

  // Exclude specific routes from token validation
  const excludedRoutes = ["/api/signin", "/api/signup", "/api/admin/signin"];
  if (excludedRoutes.some((route) => url.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized: Token is missing." }, { status: 401 });
  }

  try {
    console.log(token);
    const decoded = jwt.decode(token) as { id: string; email: string };
    console.log(decoded);
    // Add the userId to the request for downstream handlers
    const response = NextResponse.next();
    response.headers.set("userId", decoded.id);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof jwt.TokenExpiredError
        ? "Unauthorized: Token has expired."
        : "Unauthorized: Invalid token.";
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"], // Apply middleware to all API routes
};
