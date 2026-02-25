"use client";

import { useAlertModal } from "@/context/AlertModalContext";
import { X } from "lucide-react";

export default function AlertModal() {
  const { isOpen, message, closeAlertModal } = useAlertModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 size-full flex items-center justify-center z-[110]">
      <div
        onClick={closeAlertModal}
        className="fixed size-full backdrop-blur-md bg-background_2/20 pointer-events-auto z-0 cursor-pointer"
        aria-hidden
      />
      <div
        className={`
          relative
          z-1
          max-w-[400px]
          w-full
          min-h-[200px]
          my-auto
          border
          border-myBorderColor
          bg-background_1
         
          p-5
          m-5
          flex
          flex-col
          gap-3
        `}
      >
        <div className="w-full flex justify-end mb-3">
          <button
            onClick={closeAlertModal}
            className={`
              group
              w-[30px]
              h-[30px]
              bg-black
              hover:bg-white
              border
              hover:border-black
              rounded-full
              cursor-pointer
              flex
              items-center
              justify-center
            `}
          >
            <X
              className={`
                text-white
                group-hover:text-black
              `}
            />
          </button>
        </div>
        <div className="w-full flex-1 text-foreground text-[16px] leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
}
