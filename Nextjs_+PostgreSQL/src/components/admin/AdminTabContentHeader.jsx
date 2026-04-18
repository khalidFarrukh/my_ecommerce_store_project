"use client";
export default function AdminTabContentHeader({
  heading,
  description,
  right_content = "",
}) {
  return (
    <div className={`sticky z-49 top-15 mb-1 h-fit`}>
      <div className="bg-background_1 pt-3 pb-5 flex gap-5 items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{heading}</h1>
          <p className="text-myTextColorMain text-sm">{description}</p>
        </div>
        {right_content}
      </div>
      <div className="relative">
        <div className="bg-background_1 border-t border-myBorderColor"></div>
        <div className="h-6 bg-linear-to-b from-background_1 from-10% to-transparent"></div>
      </div>
    </div>
  );
}
