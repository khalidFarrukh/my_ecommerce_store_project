import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mail";

export async function POST(req) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && user.password) {
    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    await prisma.passwordResetToken.create({
      data: {
        email,
        token: hashedToken,
        expiresAt,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/resetPassword/${rawToken}`;

    // 📩 Send Email
    await transporter.sendMail({
      from: `"JinStore Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>JinStore Password Reset</h2>
          <p>You requested to reset your password.</p>
          <p>Click the button below to reset it:</p>
          <a 
            href="${resetLink}" 
            style="
              display:inline-block;
              padding:10px 20px;
              background:black;
              color:white;
              text-decoration:none;
              border-radius:4px;
            "
          >
            Reset Password
          </a>
          <p style="margin-top:20px;">
            This link expires in 1 hour.
          </p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  }

  return NextResponse.json({
    message: "If an account exists, a reset link has been sent.",
  });
}