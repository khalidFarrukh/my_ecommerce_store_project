"use client";

export default function ToggleSlideButton({
  checked,
  onChange,
  width = 44,
  height = 24,
}) {
  const innerWidth = height;
  const innerHeight = height;
  const padding = height * 0.2;
  const translateX = width - innerWidth;

  return (
    <button
      onClick={onChange}
      className={`
        flex
        items-center
        justify-center
        rounded-full
        transition-colors
        duration-200
        cursor-pointer
        ${checked ? "bg-green-500" : "bg-gray-400"}
      `}
      style={{
        width: `${width + padding}px`,
        height: `${height + padding}px`,
      }}
    >
      <span
        className="relative"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <span
          className="
          absolute
          top-0
          left-0
          bg-white
          rounded-full
          shadow
          transition-transform
          duration-200
        "
          style={{
            width: `${innerWidth}px`,
            height: `${innerHeight}px`,
            transform: checked
              ? `translateX(${translateX}px)`
              : "translateX(0px)",
          }}
        />
      </span>
    </button>
  );
}
