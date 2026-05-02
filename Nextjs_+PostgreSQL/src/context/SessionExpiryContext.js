"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { getSession, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const SessionExpiryContext = createContext(null);

export function SessionExpiryProvider({ children }) {

  const { data: liveSession, status } = useSession();
  const pathname = usePathname();

  const [timeLeft, setTimeLeft] = useState(null);
  const [sessionData, setSessionData] = useState(liveSession);
  const [sessionStatus, setSessionStatus] = useState(status);
  const isAuthenticatedForExpiry = useRef(false);

  const intervalRef = useRef(null);

  const applySession = (newSession, newStatus = "authenticated") => {
    // 🔥 ALWAYS clear old interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!newSession?.expires) {
      setSessionData(null);
      setSessionStatus("unauthenticated");
      setTimeLeft(0);
      return;
    }

    setSessionData(newSession);
    setSessionStatus(newStatus);

    const expiresAt = new Date(newSession.expires).getTime();

    const tick = () => {
      const diff = expiresAt - Date.now();

      if (diff <= 0) {
        setTimeLeft(0);
        setSessionStatus("unauthenticated");
        setSessionData(null);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        return;
      }

      setTimeLeft(diff);
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
  };

  // 1️⃣ react to next-auth session changes
  useEffect(() => {
    applySession(liveSession, status);
  }, [liveSession, status]);

  // 2️⃣ refetch on navigation (your custom sliding session logic)
  useEffect(() => {
    const sync = async () => {
      const newSession = await getSession();

      // only update if actually different (important)
      if (newSession?.expires !== sessionData?.expires) {
        applySession(newSession, newSession ? "authenticated" : "unauthenticated");
      }
    };

    sync();
  }, [pathname]);

//   useEffect(() => {
//   const handlePageShow = async (event) => {
//     // fired on back/forward cache restore
//     const newSession = await getSession();
//     applySession(newSession, newSession ? "authenticated" : "unauthenticated");
//   };

//   window.addEventListener("pageshow", handlePageShow);

//   return () => {
//     window.removeEventListener("pageshow", handlePageShow);
//   };
// }, []);

  // cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      setTimeLeft(0);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [sessionStatus]);

  return (
    <SessionExpiryContext.Provider
      value={{ timeLeft, sessionData, sessionStatus, isAuthenticatedForExpiry }}
    >
      {children}
    </SessionExpiryContext.Provider>
  );
}

export function useSessionExpiry() {
  return useContext(SessionExpiryContext);
}