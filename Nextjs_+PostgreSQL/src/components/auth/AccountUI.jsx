"use client";

import { useState } from "react";
// import { signIn } from "next-auth/react";
import LoginForm from "../../app/signIn/SigninForm";
import SignupForm from "./SignupForm";
import { useSearchParams } from "next/navigation";
import LoginUI from "./LoginUI";

export default function AccountUI({ children }) {
  const searchParams = useSearchParams();

  // if middleware added callbackUrl (?callbackUrl=/profile)
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [mode, setMode] = useState("login");

  return (
    <main className="z-1 font-poppins relative w-full bg-background_1 my-3 flex flex-col items-center">
      <section className="w-full flex flex-col items-center">
        <div className="w-full max-w-100 h-fit flex flex-col gap-5 items-center">
          {mode === "login" ? (
            <LoginUI updateMode={() => setMode("signup")} />
          ) : (
            <SignupForm updateMode={() => setMode("login")} />
          )}
        </div>
      </section>
    </main>
  );
}
