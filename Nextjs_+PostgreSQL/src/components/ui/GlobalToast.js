"use client";

import { useGlobalToast } from "@/context/GlobalToastContext";
import { useEffect, useState } from "react";
import { authEvents } from "@/lib/authEvents";
import { typeStyles } from "@/utils/staticVariables";

export default function GlobalToast() {
  const { toast, setToast } = useGlobalToast();

  const [visible, setVisible] = useState(false);
  const [displayedToast, setDisplayedToast] = useState(null);

  // 🔥 listen to events (same as before)
  useEffect(() => {
    const unsubExpired = authEvents.on("auth:expired", () => {
      setToast({ message: "Session expired. Please sign in again.", type: "error" });
    });

    const unsubLogout = authEvents.on("auth:logout", () => {
      setToast({ message: "Logged out", type: "info" });
    });

    const unsubLogin = authEvents.on("auth:login", () => {
      setToast({ message: "Logged in", type: "success" });
    });

    const unsubError = authEvents.on("auth:error", (data) => {
      setToast({ message: data.message, type: "error" });
    });

    const unsubForbidden = authEvents.on("auth:forbidden", (data) => {
      setToast({ message: data.message, type: "error" });
    });

    return () => {
      unsubExpired();
      unsubLogout();
      unsubLogin();
      unsubError();
      unsubForbidden();
    };
  }, [setToast]);

  // 🔥 MAIN FIX: control transition lifecycle
  useEffect(() => {
    if (!toast) return;

    // if something is already visible → exit first
    if (displayedToast) {
      setVisible(false);

      const exitTimer = setTimeout(() => {
        setDisplayedToast(toast); // swap content AFTER exit

        requestAnimationFrame(() => {
          setVisible(true); // enter animation
        });
      }, 300); // match CSS duration

      return () => clearTimeout(exitTimer);
    }

    // first toast (no previous)
    setDisplayedToast(toast);
    requestAnimationFrame(() => setVisible(true));
  }, [toast]);

  // auto hide
  useEffect(() => {
    if (!displayedToast) return;

    const timer = setTimeout(() => {
      setVisible(false);

      setTimeout(() => {
        setDisplayedToast(null);
        setToast(null);
      }, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [displayedToast, setToast]);

  if (!displayedToast) return null;

  return (
    <div
      className={`
        fixed top-[calc(20px+60px)] right-5 z-50
        px-4 py-2 rounded shadow text-white
        transition-transform duration-300
        ${visible ? "translate-x-0" : "translate-x-[120%]"}
        ${typeStyles[displayedToast.type] || "bg-gray-500!"}
      `}
    >
      {displayedToast.message}
    </div>
  );
}