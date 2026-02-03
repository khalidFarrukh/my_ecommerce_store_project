
import Image from "next/image";

export default function Card2({ productObj }) {
  return (
    <>
      <div
        className=
        {`
          flex-1
          w-full
          h-full
          rounded-[12px]
          bg-[#fafafa]
          border-1
          border-[var(--myBorderColor)]
          flex
          items-center
          justify-center
        `}
      >
        <Image
          src={productObj.thumbLink}
          alt={productObj.name}
          width={1200}
          height={1200}
          priority
        />
      </div>
    </>
  );
}