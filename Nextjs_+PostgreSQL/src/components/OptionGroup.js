"use client";

export default function OptionGroup({
  label,
  values,
  selectedValue,
  validValues,
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
            disabled={!validValues.includes(value)}
            className={`
              px-3 py-1 border rounded
              ${selectedValue === value ? "button1_active" : "button1"}
              ${!validValues.includes(value) ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
