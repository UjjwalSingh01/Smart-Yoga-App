import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function middleware(req: Request) {
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      req.headers.set("userId", decoded.id);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/protected/:path*"], // Protect specific routes
};
