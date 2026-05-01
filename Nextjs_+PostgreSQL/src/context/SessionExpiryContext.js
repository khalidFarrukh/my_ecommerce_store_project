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
    if (!newSession?.expires) {
      setSessionData(null);
      setSessionStatus("unauthenticated");
      setTimeLeft(0);
      return;
    }

    console.log(newSession);
    console.log("timeLEft", timeLeft);
    setSessionData(newSession);
    setSessionStatus(newStatus);

    const expiresAt = new Date(newSession.expires).getTime();

    // restart timer cleanly
    if (intervalRef.current) clearInterval(intervalRef.current);

    const tick = () => {
      const diff = expiresAt - Date.now();

      if (diff <= 0) {
        setTimeLeft(0);
        setSessionStatus("unauthenticated");
        setSessionData(null);
        clearInterval(intervalRef.current);
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

  // cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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