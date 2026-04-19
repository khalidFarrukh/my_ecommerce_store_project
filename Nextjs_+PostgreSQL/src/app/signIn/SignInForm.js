"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingInput from "@/components/FloatingInput";
import Link from "next/link";

export default function SignInForm() {
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

    const session = await getSession();

    const safeCallBack = callbackUrl.startsWith("/") ? callbackUrl : "/";

    // 🚨 user trying to access admin route
    if (safeCallBack.startsWith("/admin") && session?.user?.role !== "ADMIN") {
      setError("Only admin have access on this page.");
      return;
    }

    // ADMIN redirect
    if (session?.user?.role === "ADMIN") {
      router.push("/admin");
      return;
    }

    // normal user redirect
    router.push(safeCallBack);
  };

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">
        Welcome Back
      </h1>

      <p className="text-center text-sm text-[gray]">
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
        <p className="mt-3 w-full flex gap-1 items-center justify-end font-medium">
          Forgot password?
          <Link
            href="/forgotPassword"
            className="
            text-sm 
            text-myTextColorMain 
            hover:underline 
            cursor-pointer
            "
          >
            Click here
          </Link>
        </p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full py-2 button1 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="text-center text-sm">
        Not a member?{" "}
        <Link
          href="/signUp"
          className="hover:underline font-medium cursor-pointer"
        >
          Join us
        </Link>
      </p>
    </>
  );
}
