import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

export async function POST(req) {
  try {
    const body = await req.json();

    // =========================
    // 1️⃣ Validate input (Zod)
    // =========================
    const schema = z.object({
      email: z.email().min(5).max(100),
      password: z.string().min(6).max(100),
    });

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: "Password is too short" },
        { status: 400 }
      );
    }

    let { email, password } = parsed.data;

    // =========================
    // 2️⃣ Normalize email
    // =========================
    email = email.toLowerCase().trim();

    // =========================
    // 3️⃣ Check existing user
    // =========================
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // =========================
    // 4️⃣ Hash password
    // =========================
    const hashedPassword = await bcrypt.hash(password, 12);

    // =========================
    // 5️⃣ Create user
    // =========================
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        role: true,
      }, // ✅ NEVER return password
    });

    // =========================
    // 6️⃣ Response
    // =========================
    return Response.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Signup error:", error);

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}