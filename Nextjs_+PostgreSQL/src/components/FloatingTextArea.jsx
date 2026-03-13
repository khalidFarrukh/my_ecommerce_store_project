import React, { useState } from "react";

export default function FloatingTextArea({
  id,
  label,
  className = "",
  inputClassName = "",
  ...inputprops
}) {
  const [focused, setFocused] = useState(false);

  const hasValue = inputprops.value && inputprops.value !== "";

  return (
    <div className={`relative w-full ${className}`}>
      <textarea
        id={id}
        className={`
            w-full
            h-14
            px-4
            pt-6
            text-base
            bg-inputBgNormal
            border
            border-myBorderColor
            rounded-md
            outline-none
            focus:border-foreground
            focus:ring-2
            focus:ring-foreground/20
            ${inputClassName}
          `}
        {...inputprops}
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
              focused || hasValue
                ? "top-2 text-xs translate-y-0 text-myTextColorMain"
                : "top-1/2 -translate-y-1/2 text-md text-myBorderColor"
            }
          `}
      >
        {label}
        {inputprops.required && <span className="text-red-500"> *</span>}
      </label>
    </div>
  );
}
