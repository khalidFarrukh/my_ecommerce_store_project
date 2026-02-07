"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingInput from "@/components/FloatingInput";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // if middleware added callbackUrl (?callbackUrl=/profile)
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password");
      return;
    }

    const safeCallBack = callbackUrl.startsWith("/") ? callbackUrl : "/";

    router.push(safeCallBack);
  };

  return (
    <>
      <h1 className="text-center font-semibold text-lg uppercase">
        Welcome Back
      </h1>

      <p className="text-center text-sm text-gray-500">
        Sign in to access an enhanced shopping experience.
      </p>

      <form
        className="w-full flex flex-col gap-3 items-center "
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

        <FloatingInput
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full py-2 bg-black text-white rounded cursor-pointer disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </>
  );
}
