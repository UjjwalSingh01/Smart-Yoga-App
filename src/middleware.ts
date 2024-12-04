import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  return NextResponse.next(); // Allow access to all pages
}

export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/blogs',
    '/cart',
    '/orders',
    '/social',
    '/admin/dashboard',
    '/admin/blogs',
    '/admin/product',
    '/admin/socials',
  ],
};
