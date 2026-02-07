"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import FloatingInput from "@/components/FloatingInput";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      // // 2️⃣ Immediately log in via NextAuth
      await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
    } else {
      alert(data.error);
    }

    setLoading(false);

    const safeCallBack = callbackUrl.startsWith("/") ? callbackUrl : "/";
    router.push(safeCallBack);
  };

  return (
    <>
      <h1 className="text-center font-semibold text-lg uppercase">
        Become member
      </h1>

      <p className="text-center text-sm text-gray-500">
        Create your profile, and get access to an enhanced shopping experience.
      </p>
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

        <FloatingInput
          id="password"
          label="Password"
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

        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full py-2 bg-black text-white rounded cursor-pointer disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join"}
        </button>
      </form>
    </>
  );
}
