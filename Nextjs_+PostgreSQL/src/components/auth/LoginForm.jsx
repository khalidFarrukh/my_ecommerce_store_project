"use client";
import { useState } from "react";
import FloatingInput from "@/components/FloatingInput";

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <h1 className="text-center font-semibold text-lg uppercase">
        Welcome Back
      </h1>

      <p className="text-center text-sm text-gray-500">
        Sign in to access an enhanced shopping experience.
      </p>

      <form className="w-full flex flex-col gap-3 items-center">
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

        <button className="mt-3 w-full py-2 bg-black text-white rounded cursor-pointer">
          Login
        </button>
      </form>
    </>
  );
}
