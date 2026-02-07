"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AccountUI() {
  const [mode, setMode] = useState("login");

  return (
    <main className="z-1 font-poppins relative w-full bg-white my-3 flex flex-col items-center">
      <section className="w-full flex flex-col items-center">
        <div className="w-full max-w-100 h-fit flex flex-col gap-5 items-center">
          {mode === "login" ? (
            <>
              <LoginForm />
              <p className="text-center text-sm">
                Not a member?{" "}
                <button
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
  );
}
