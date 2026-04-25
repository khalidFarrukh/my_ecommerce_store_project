// middleware.js

import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  // redirect to /signIn if not authenticated
  pages: {
    signIn: "/signIn",
  },
});


export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin")) {
    // ❌ not logged in
    if (!token) {
      return NextResponse.redirect(
        new URL(`/signIn?callbackUrl=${pathname}`, req.url)
      );
    }

    // ❌ logged in but not admin
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/`, req.url));
    }
  }
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: [
    // "/cart",
    "/profile",
    "/checkout",
    "/admin/:path*",
  ],
};
