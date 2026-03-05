"use client";

import { useState } from "react";
// import { signIn } from "next-auth/react";
import LoginForm from "../../app/signIn/SigninForm";
import SignupForm from "./SignupForm";
import { useSearchParams } from "next/navigation";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function LoginUI({ updateMode }) {
  const [mode, setMode] = useState("normal");

  return (
    <>
      {mode === "normal" ? (
        <>
          <LoginForm updateMode={() => setMode("forgot")} />
          <p className="text-center text-sm">
            Not a member?{" "}
            <button
              onClick={updateMode}
              className="underline font-medium cursor-pointer"
            >
              Join us
            </button>
          </p>
        </>
      ) : (
        <ForgotPasswordForm updateMode={() => setMode("normal")} />
      )}
    </>
  );
}
