import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import Facebook from "next-auth/providers/facebook";
// import Apple from "next-auth/providers/apple";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const authConfig = {
  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // =========================
        // 1️⃣ Validate input with Zod
        // =========================
        const schema = z.object({
          email: z.email().min(5).max(100),
          password: z.string().min(4).max(100),
        });

        const parsed = schema.safeParse(credentials);

        if (!parsed.success) {
          return null; // 🚫 invalid input → stop immediately
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        // ⚠️ prevents OAuth users logging in via credentials
        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),

    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),

    // Facebook({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),

    // Apple({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET,
    // }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 7 days
    updateAge: 30,
  },

  jwt: {
    maxAge: 60 * 60,
    updateAge: 30,
  },

  callbacks: {
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.role = user.role;
    //   }
    //   return token;
    // }
    async jwt({ token, user }) {
      // initial login
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // if (!token.id) return token;
      if (token)

        // 🚨 ONLY check DB for ADMIN users
        if (token.role === "ADMIN") {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: { role: true },
          });

          // user deleted or demoted
          if (!dbUser) {
            return null; // force logout (safest)
          }

          // enforce latest DB role
          if (dbUser.role !== "ADMIN") {
            token.role = dbUser.role; // demote immediately
          }
        }

      return token;
    }
    ,

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    async signIn() {
      // PrismaAdapter automatically links OAuth accounts
      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default authConfig;
