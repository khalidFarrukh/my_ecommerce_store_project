"use client";

import { useState } from "react";
import FloatingInput from "@/components/FloatingInput";

export default function ForgotPasswordForm({ updateMode }) {
  const [form, setForm] = useState({
    email: "",
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
    setLoading(true);

    try {
      const res = await fetch("/api/password-forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      // Always show success message (security)
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <h1 className="text-center font-semibold text-lg uppercase">
        We are here to help
      </h1>

      <p className="text-center text-sm text-[gray]">
        Enter your email to receive a password reset link.
      </p>

      {success ? (
        <div className="text-center space-y-3">
          <p className="text-sm">
            If an account exists, a reset link has been sent to your email.
          </p>

          <button
            onClick={updateMode}
            className="text-sm hover:underline cursor-pointer"
          >
            Back to Sign in
          </button>
        </div>
      ) : (
        <form
          className="w-full flex flex-col gap-3 items-center"
          onSubmit={handleSubmit}
        >
          <FloatingInput
            id="email"
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
          />

          <p className="mt-3 text-center flex items-center gap-2 justify-end w-full text-sm">
            Remember your password?
            <button
              type="button"
              onClick={updateMode}
              className="text-myTextColorMain hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full py-2 button1 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating link..." : "Create link"}
          </button>
        </form>
      )}
    </>
  );
}
