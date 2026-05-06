"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FloatingInput from "@/components/FloatingInput";
import Link from "next/link";
import { useGlobalToast } from "@/context/GlobalToastContext";
import { resetPasswordSchema } from "@/schemas/ResetPasswordSchema";

export default function ResetPasswordForm() {
  const { raw_token } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const { setToast } = useGlobalToast();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const parsed = resetPasswordSchema.safeParse({
      token: raw_token,
      newPassword: form.password,
      confirmPassword: form.confirmPassword,
    })

    if (!parsed.success) {
      setTimeout(() => {
        setToast({
          id: Date.now(),
          message: parsed.error.issues[0].message,
          type: "error"
        });
      }, 0)
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/signIn");
      setTimeout(() => {
        setToast({
          id: Date.now(),
          message: "Password has been reset.",
          type: "info"
        });
      }, 0)

    } catch (err) {
      setTimeout(() => {
        setToast({
          id: Date.now(),
          message: err.message,
          type: "error"
        });
      }, 0)
    }

    setLoading(false);
  };

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">
        Reset Your Password
      </h1>
      <p className="text-center text-sm text-[gray]">
        Enter your new password below.
      </p>
      <form
        className="w-full flex flex-col gap-3 items-center"
        onSubmit={handleSubmit}
      >
        <FloatingInput
          id="password"
          label="New Password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
        />

        <FloatingInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          required
          value={form.confirmPassword}
          onChange={handleChange}
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full py-2 button1 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}
