"use client";

import { useGlobalToast } from "@/context/GlobalToastContext";
import { useEffect, useRef, useState } from "react";
import { typeStyles } from "@/utils/staticVariables";

export default function GlobalToast() {
  const { toast, setToast } = useGlobalToast();

  const [displayedToast, setDisplayedToast] = useState(null);
  const [visible, setVisible] = useState(false);

  const timeoutRef = useRef(null);
  const phaseRef = useRef("idle"); // idle | exiting | entering

  useEffect(() => {
    if (!toast) return;

    // clear any previous timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // IF same toast id comes again → ignore flicker
    if (displayedToast?.id === toast.id) return;

    // start exit phase if something already visible
    if (displayedToast) {
      phaseRef.current = "exiting";
      setVisible(false);

      timeoutRef.current = setTimeout(() => {
        setDisplayedToast(toast);

        // next frame guarantees clean DOM paint
        requestAnimationFrame(() => {
          phaseRef.current = "entering";
          setVisible(true);
        });
      }, 250);

      return;
    }

    // first mount
    setDisplayedToast(toast);

    requestAnimationFrame(() => {
      phaseRef.current = "entering";
      setVisible(true);
    });
  }, [toast?.id]);

  // auto hide
  useEffect(() => {
    if (!displayedToast) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);

      timeoutRef.current = setTimeout(() => {
        setDisplayedToast(null);
        setToast(null);
        phaseRef.current = "idle";
      }, 250);
    }, 4000);

    return () => clearTimeout(timeoutRef.current);
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