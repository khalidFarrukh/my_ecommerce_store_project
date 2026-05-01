"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSessionExpiry } from "@/context/SessionExpiryContext";
import { useGlobalToast } from "@/context/GlobalToastContext";

export default function GlobalSessionGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { timeLeft, sessionStatus, isAuthenticatedForExpiry } = useSessionExpiry();
  const { setToast } = useGlobalToast();


  const hasRedirectedAfterExpiry = useRef(false);
  const shouldShowToast = useRef(false); // 👈 NEW

  const searchParams = useSearchParams();

  useEffect(() => {
    if (timeLeft === null) return;

    // session active
    if (sessionStatus === "authenticated" && timeLeft > 0) {
      isAuthenticatedForExpiry.current = true;
      hasRedirectedAfterExpiry.current = false;
      shouldShowToast.current = false;
      return;
    }

    // 🔥 session expired
    if (
      timeLeft <= 0 &&
      isAuthenticatedForExpiry.current &&
      !hasRedirectedAfterExpiry.current &&
      pathname !== "/signIn"
    ) {
      // 👉 decide toast behavior
      if (document.visibilityState === "visible") {
        // show immediately
        setToast({
          id: Date.now(),
          message: "Session expired. Please sign in again.",
          type: "error",
        });
      } else {
        // delay until user comes back
        shouldShowToast.current = true;
      }

      hasRedirectedAfterExpiry.current = true;
      isAuthenticatedForExpiry.current = false;

      // ✅ redirect immediately
      router.replace(`/signIn?callbackUrl=${pathname}`);
    }
  }, [timeLeft, sessionStatus, pathname, searchParams, router, setToast]);

  // 👀 show toast when user returns
  useEffect(() => {
    const handleVisibility = () => {
      if (
        document.visibilityState === "visible" &&
        shouldShowToast.current
      ) {
        shouldShowToast.current = false;

        setToast({
          id: Date.now(),
          message: "Session expired. Please sign in again.",
          type: "error",
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility); // extra reliability

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [setToast]);

  return null;
}