"use client";

import { useState } from "react";
// import { signIn } from "next-auth/react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useSearchParams } from "next/navigation";

export default function AccountUI() {
  const searchParams = useSearchParams();

  // if middleware added callbackUrl (?callbackUrl=/profile)
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [mode, setMode] = useState("login");

  return (
    <main className="z-1 font-poppins relative w-full bg-background_1 my-3 flex flex-col items-center">
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
              {/* <div className="my-5">Or</div>
              <div className="w-full flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl })}
                  className="w-full border py-2 rounded"
                >
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={() => signIn("facebook", { callbackUrl })}
                  className="w-full border py-2 rounded"
                >
                  Continue with Facebook
                </button>
              </div> */}
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
