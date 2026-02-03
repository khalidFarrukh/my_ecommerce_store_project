"use client"
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import React, { useState, useEffect } from "react";

export default function Account() {

  const [mode, setMode] = useState("login"); // "login" | "signup"

  return (
    <>
      <main
        className=
        {`
          z-1
          relative
          w-full
          bg-white
          my-3
          flex
          flex-col
          items-center
        `}
      >
        <section
          className=
          {`
            w-full
            flex
            flex-col
            items-center
          `}
        >
          <div className="w-full max-w-[400px] h-fit flex flex-col gap-5 items-center">

            {mode === "login" ? (
              <>
                <LoginForm />
                <p className="text-center text-sm">
                  Not a member?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="underline font-medium cursor-pointer"
                  >
                    Join us
                  </button>
                </p>
              </>
            ) : (
              <>
                <SignupForm />
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="underline font-medium cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}