// middleware.js

import { withAuth } from "next-auth/middleware";

export default withAuth({
  // redirect to /account if not authenticated
  pages: {
    signIn: "/account",
  },
});

export const config = {
  matcher: [
    // "/cart",
    "/profile",
    "/checkout",
    "/admin",
  ],
};
