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
            px-4
            pt-6
            pb-2
            text-sm
            border
            border-myBorderColor
            rounded-md
            outline-none
            focus:border-foreground/20
            focus:ring-2
            focus:ring-foreground/20
            resize-none overflow-hidden
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
          z-1
          absolute
          w-full
          left-4
          transition-all
          duration-200
          pointer-events-none
          ${
            focused || hasValue
              ? "top-2 text-xs translate-y-0 text-myTextColorMain"
              : "top-11 -translate-y-7 text-md text-myTextColorMain/50"
          }
        `}
      >
        {label}
        {inputprops.required && <span className="text-red-500"> *</span>}
      </label>
    </div>
  );
}
