// middleware.js

export { default } from "next-auth/middleware";

// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   // redirect to /account if not authenticated
//   pages: {
//     signIn: "/account",
//   },
// });

export const config = {
  matcher: [
    "/profile",
    "/checkout",
    "/orders",
    "/admin",
    "/cart",
  ],
};
