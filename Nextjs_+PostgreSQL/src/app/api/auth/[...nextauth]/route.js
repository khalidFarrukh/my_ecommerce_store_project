// [...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("CREDENTIALS:", credentials);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("USER FOUND:", user);

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        console.log("PASSWORD VALID:", isValid);

        if (!isValid) return null;

        return user;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 1,
  },
  jwt: {
    maxAge: 60 * 1,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

