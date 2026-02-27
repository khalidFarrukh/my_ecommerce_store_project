"use client";

export default function OptionGroup({
  label,
  values,
  selectedValue,
  onSelect
}) {
  return (
    <div className="mb-4">
      <p className="mb-2 font-semibold capitalize">
        {label}
      </p>

      <div className="flex gap-2 flex-wrap">
        {values.map(value => (
          <button
            key={value}
            onClick={() => onSelect(label, value)}
            className={`
              px-3 py-1 border rounded cursor-pointer
              ${selectedValue === value
                ? "button2_active"
                : "button2"}
            `}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
