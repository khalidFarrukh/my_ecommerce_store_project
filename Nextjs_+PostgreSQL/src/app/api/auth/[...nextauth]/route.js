// // [...nextauth]/route.js

import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// this exports GET and POST handlers directly for the Next.js Route Handler
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
