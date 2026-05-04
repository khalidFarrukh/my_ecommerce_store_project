"use client";

import { useEffect, useState } from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingInput from "@/components/FloatingInput";
import Link from "next/link";
import { useGlobalToast } from "@/context/GlobalToastContext";
import { useSessionExpiry } from "@/context/SessionExpiryContext";

export default function SignInForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAppReady, setIsAppReady] = useState(false);

  const searchParams = useSearchParams();

  // const { timeLeft, sessionData: session, sessionStatus: status } = useSessionExpiry();
  const { setToast } = useGlobalToast();

  useEffect(() => {
    setIsAppReady(true);
  }, []);

  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const safeCallBack = callbackUrl.startsWith("/") ? callbackUrl : "/";
    const expired = searchParams.get("expired");

    if (expired === "1") return;
    // ✅ If already logged in → redirect immediately
    if (session && status === "authenticated") {
      if (
        safeCallBack.startsWith("/admin") &&
        session?.user?.role !== "ADMIN"
      ) {
        router.replace("/?error=only_admin_allowed");
        return;
      }

      router.replace(
        session?.user?.role === "ADMIN" ? "/admin" : safeCallBack
      );
      return;
    }
  }, [router, searchParams, session]);

  useEffect(() => {

    if (!isAppReady) return;

    // ❗ Only run this if NOT logged in
    const error = searchParams.get("error");

    if (error === "auth_required" && !session) {

      setTimeout(() => {

        setToast({
          id: Date.now(),
          message: "You must be signed in to view this page.",
          type: "error",
        });
      }, 0)

      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");

      const query = params.toString();
      router.replace(query ? `/signIn?${query}` : "/signIn");
    }
  }, [router, searchParams, isAppReady]);

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

    if ((!result || result.error) && isAppReady) {

      setToast({
        id: Date.now(),
        message: "Invalid email or password",
        type: "error",
      });
      return;
    }

    const session = await getSession();

    const safeCallBack = callbackUrl.startsWith("/") ? callbackUrl : "/";

    // 🛡️ fallback protection (client-side)
    if (safeCallBack.startsWith("/admin") && session?.user?.role !== "ADMIN") {
      // setToast({
      //   id: Date.now(),
      //   message: "Only admin have access on this page.",
      //   type: "error",
      // });
      router.push("/?error=only_admin_allowed");
      return;
    }

    // ADMIN redirect
    if (session?.user?.role === "ADMIN") {
      // here will show the admin logged in successfully toast, as they are also users and can login via credentials, so will show the logged in successfully toast here
      // setToast({
      //   id: Date.now(),
      //   message: "Logged In",
      //   type: "success",
      // });

      router.push(safeCallBack);

      setTimeout(() => {
        // 🔥 ignore manual logout
        if (window.__MANUAL_LOGOUT__) {
          window.__MANUAL_LOGOUT__ = false; // reset
        }

        setToast({
          id: Date.now(),
          message: "Logged In",
          type: "success",
        });
      }, 0);



      return;
    }

    // here only user will reach, so redirect to their intended page or homepage, so will show the logged in successfully toast here
    // setToast({
    //   id: Date.now(),
    //   message: "Logged In",
    //   type: "success",
    // });

    // normal user redirect
    router.push(safeCallBack);
    setTimeout(() => {
      // 🔥 ignore manual logout
      if (window.__MANUAL_LOGOUT__) {
        window.__MANUAL_LOGOUT__ = false; // reset
      }

      setToast({
        id: Date.now(),
        message: "Logged In",
        type: "success",
      });
    }, 0);


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
