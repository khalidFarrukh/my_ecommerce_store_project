"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FloatingInput from "@/components/FloatingInput";

export default function ResetPasswordForm() {
  const { raw_token } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.newPassword.length < 3) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: raw_token,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <>
      <h1 className="text-center font-semibold text-lg uppercase">
        Reset Your Password
      </h1>

      {success ? (
        <div className="text-center space-y-3">
          <p className="text-sm">Your password has been successfully reset.</p>

          <button
            onClick={() => router.push("/account")}
            className="text-sm hover:underline cursor-pointer"
          >
            Go to Sign in
          </button>
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-[gray]">
            Enter your new password below.
          </p>
          <form
            className="w-full flex flex-col gap-3 items-center"
            onSubmit={handleSubmit}
          >
            <FloatingInput
              id="newPassword"
              label="New Password"
              type="password"
              required
              value={form.newPassword}
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
      )}
    </>
  );
}
