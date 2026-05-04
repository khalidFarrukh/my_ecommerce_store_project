import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Token and new password are required." },
        { status: 400 }
      );
    }

    // Hash the token to match what is stored in DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find reset token record
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired token or already used token." },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: resetRecord.email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "User not found or password reset not allowed." },
        { status: 400 }
      );
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { message: "New password must be different from old password." },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword },
    });

    // Delete the token
    await prisma.passwordResetToken.delete({
      where: { token: hashedToken },
    });

    // Optional: Invalidate all user sessions here if you want extra security
    // await prisma.session.deleteMany({ where: { userId: user.id } });

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