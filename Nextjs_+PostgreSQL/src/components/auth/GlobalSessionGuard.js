"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGlobalToast } from "@/context/GlobalToastContext";
import { useSession, signOut } from "next-auth/react";

export default function GlobalSessionGuard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { setToast } = useGlobalToast();

  const hasHandledExpiry = useRef(false);
  const wasAuthenticated = useRef(false); // 🔥 NEW
  const intervalRef = useRef(null);
  const isRestoredFromBFCache = useRef(false);

  useEffect(() => {
    update(); // re-sync session on navigation
  }, [pathname]);

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        isRestoredFromBFCache.current = true;
        // allow React to settle, then refresh
        setTimeout(() => {
          router.refresh();
        }, 0);
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  // ===============================
  // 🧠 Track auth history
  // ===============================
  useEffect(() => {
    if (status === "authenticated") {
      wasAuthenticated.current = true;
      hasHandledExpiry.current = false; // reset on login
    }
  }, [pathname, status]);

  // ===============================
  // 🧠 REAL-TIME EXPIRY
  // ===============================
  useEffect(() => {
    if (!session?.expires) return;
    if (isRestoredFromBFCache.current) return;

    const expiresAt = new Date(session.expires).getTime();

    const checkExpiry = () => {
      const now = Date.now();

      if (
        now >= expiresAt &&
        !hasHandledExpiry.current &&
        wasAuthenticated.current &&// 🔥 important
        !window.__MANUAL_LOGOUT__
      ) {
        hasHandledExpiry.current = true;
        wasAuthenticated.current = false;

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        signOut({ redirect: false });


        if (pathname !== "/signIn") {
          router.replace(`/signIn?callbackUrl=${pathname}&expired=1`);
          setTimeout(() => {

            setToast({
              id: Date.now(),
              message: "Session expired. Please sign in again.",
              type: "error",
            });
          }, 0)
        }

      }
    };

    checkExpiry();
    intervalRef.current = setInterval(checkExpiry, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session, pathname, router, setToast]);

  // ===============================
  // 🧠 FALLBACK (fixed)
  // ===============================
  useEffect(() => {
    if (status === "loading") return;
    if (isRestoredFromBFCache.current) return;


    if (
      status === "unauthenticated" &&
      wasAuthenticated.current && // 🔥 ONLY if user had session before
      !hasHandledExpiry.current &&
      !window.__MANUAL_LOGOUT__
    ) {
      hasHandledExpiry.current = true;
      wasAuthenticated.current = false;

      if (pathname !== "/signIn") {
        router.replace(`/signIn?callbackUrl=${pathname}&expired=1`);
        setTimeout(() => {
          setToast({
            id: Date.now(),
            message: "Session expired. Please sign in again.",
            type: "error",
          });
        }, 0);
      }

    }
  }, [status, pathname, router, setToast]);

  return null;
}