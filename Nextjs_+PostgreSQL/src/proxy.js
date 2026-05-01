// proxy.js

import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// export default withAuth({
//   // redirect to /signIn if not authenticated
//   pages: {
//     signIn: "/signIn",
//   },
// });


export async function proxy(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/signIn")) return;
  // ❌ not logged in
  if ((!token || !token.id)) {
    return NextResponse.redirect(
      new URL(`/signIn?callbackUrl=${pathname}&error=auth_required`, req.url)
    );
  }
  if (token.role !== "ADMIN") {
    if (pathname.startsWith("/admin")) {
      // ❌ logged in but not admin
      return NextResponse.redirect(new URL(`/?error=only_admin_allowed`, req.url));
    }

  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/cart",
    "/profile",
    "/checkout",
    "/admin/:path*",
  ],
};
