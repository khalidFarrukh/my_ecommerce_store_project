"use client";
import React, { useState } from "react";

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

  const { placeholder, ...restInputProps } = inputprops;

  const hasValue = inputprops.value && inputprops.value !== "";

  return (
    <div className={`w-full space-y-1 ${className}`}>
      <div className="relative w-full">
        <input
          id={id}
          className={`
          w-full
          min-h-14
          h-14
          px-4
          pt-6
          text-sm
          border
          border-myBorderColor
          rounded-md
          outline-none
          ${error ? "border-red-500 focus:ring-red-500" : "focus:border-foreground/20 focus:ring-foreground/20"}
          ${inputClassName}
        `}
          {...restInputProps}
          placeholder={focused ? placeholder : ""}
          onFocus={(e) => {
            setFocused(true);
            inputprops.onFocus?.(e); // call parent onFocus
          }}
          onBlur={(e) => {
            setFocused(false);
            inputprops.onBlur?.(e); // call parent onBlur
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
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
