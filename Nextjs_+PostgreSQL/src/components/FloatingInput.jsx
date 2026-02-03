"use client";
import React from "react";

export default function FloatingInput({
  id,
  label,
  type = "text",
  required = false,
  value,
  onChange,
  className = "",
  inputProps = {},
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="
          peer
          w-full
          h-[56px]
          px-4
          pt-6
          text-base
          bg-[#fafafa]
          border
          border-[var(--myBorderColor)]
          rounded-md
          outline-none
          focus:border-black
        "
        {...inputProps}
      />

      <label
        htmlFor={id}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-500
          text-md
          transition-all
          duration-200
          pointer-events-none

          peer-focus:top-2
          peer-focus:text-xs
          peer-focus:text-black
          peer-focus:translate-y-0

          peer-valid:top-2
          peer-valid:text-xs
          peer-valid:translate-y-0
        "
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
    </div>
  );
}
