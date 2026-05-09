"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function FloatingInput({
  id,
  label,
  className = "",
  inputClassName = "",
  keepPlaceHolderAbove = false,
  error = "",
  ...inputprops
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { placeholder, type, ...restInputProps } = inputprops;

  const hasValue = inputprops.value && inputprops.value !== "";

  const isPassword = type === "password";

  return (
    <div className={`w-full space-y-1 ${className}`}>
      <div className="relative w-full">
        <input
          id={id}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`
          w-full
          min-h-14
          h-14
          px-4
          ${isPassword ? "pr-12" : ""}
          pt-6
          text-sm
          border
          border-myBorderColor
          rounded-md
          outline-none
          bg-transparent
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "focus:border-foreground/20 focus:ring-foreground/20"
          }
          ${inputClassName}
        `}
          {...restInputProps}
          placeholder={focused ? placeholder : ""}
          onFocus={(e) => {
            setFocused(true);
            inputprops.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputprops.onBlur?.(e);
          }}
        />

        <label
          htmlFor={id}
          className={`
          absolute
          left-4
          transition-all
          duration-200
          pointer-events-none
          ${
            focused || hasValue || keepPlaceHolderAbove
              ? "top-2 text-xs translate-y-0 text-myTextColorMain"
              : "top-1/2 -translate-y-1/2 text-md text-myTextColorMain/50"
          }
        `}
        >
          {label}
          {inputprops.required && <span className="text-red-500"> *</span>}
        </label>

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2

            bg-background_2
            hover:bg-buttonHovered
            cursor-pointer
            "
          >
            {hasValue && (
              <>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
