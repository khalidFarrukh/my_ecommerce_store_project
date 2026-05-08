import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/schemas/ResetPasswordSchema";

export async function POST(req) {
  try {
    const body = await req.json();

    // ======================
    // 1️⃣ Validate input
    // ======================
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      // console.log(parsed.error.issues);

      return NextResponse.json(
        {
          message: parsed.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { token, newPassword } = parsed.data;

    // ======================
    // 2️⃣ Hash token
    // ======================
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // ======================
    // 3️⃣ Find reset record
    // ======================
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    // ======================
    // 4️⃣ Find user
    // ======================
    const user = await prisma.user.findUnique({
      where: { email: resetRecord.email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "User not found or not allowed." },
        { status: 400 }
      );
    }

    // ======================
    // 5️⃣ Prevent same password
    // ======================
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return NextResponse.json(
        { message: "New password must be different from old password." },
        { status: 400 }
      );
    }

    // ======================
    // 6️⃣ Hash new password
    // ======================
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // ======================
    // 7️⃣ Update user
    // ======================
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword },
    });

    // ======================
    // 8️⃣ Delete token
    // ======================
    await prisma.passwordResetToken.delete({
      where: { token: hashedToken },
    });

    return NextResponse.json({
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}