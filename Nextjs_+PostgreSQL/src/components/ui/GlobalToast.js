"use client";

import { useGlobalToast } from "@/context/GlobalToastContext";
import { useEffect, useState } from "react";
import { typeStyles } from "@/utils/staticVariables";

export default function GlobalToast() {
  const { toast, setToast } = useGlobalToast();

  const [visible, setVisible] = useState(false);
  const [displayedToast, setDisplayedToast] = useState(null);

  // handle enter/exit animation lifecycle
  useEffect(() => {
    if (!toast) return;

    if (displayedToast) {
      setVisible(false);

      const exitTimer = setTimeout(() => {
        setDisplayedToast(toast);

        // more reliable than requestAnimationFrame
        setTimeout(() => setVisible(true), 10);
      }, 300);

      return () => clearTimeout(exitTimer);
    }

    setDisplayedToast(toast);
    setTimeout(() => setVisible(true), 10);
  }, [toast?.id]); // 👈 important improvement

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
        fixed top-[calc(20px+60px)] right-5 z-200
        px-4 py-2 rounded shadow text-white
        transition-transform duration-300
        ${visible ? "translate-x-0" : "translate-x-[120%]"}
        ${typeStyles[displayedToast.type] || "bg-gray-500"}
      `}
    >
      {displayedToast.message}
    </div>
  );
}