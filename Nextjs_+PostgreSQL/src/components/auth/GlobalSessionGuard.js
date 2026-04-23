"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGlobalToast } from "@/context/GlobalToastContext";
import { authEvents } from "@/lib/authEvents";

export default function GlobalSessionGuard() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { setToast } = useGlobalToast();

  const wasAuthenticated = useRef(false);
  const hasRedirectedAfterExpiry = useRef(false);

  useEffect(() => {
    // user is authenticated → reset flags
    if (status === "authenticated") {
      wasAuthenticated.current = true;
      hasRedirectedAfterExpiry.current = false;
      return;
    }

    // session expired → redirect ONLY ONCE
    if (
      status === "unauthenticated" &&
      wasAuthenticated.current &&
      !hasRedirectedAfterExpiry.current &&
      pathname !== "/signIn"

    ) {


      hasRedirectedAfterExpiry.current = true;
      // ✅ prevent false "session expired"
      if (authEvents.consumeManualLogout()) {
        return;
      }
      // 🔥 Trigger toast BEFORE redirect
      authEvents.emit("auth:expired");

      router.push(`/signIn?callbackUrl=${pathname}`);
    }
  }, [status, pathname, router]);

  return null;
}

