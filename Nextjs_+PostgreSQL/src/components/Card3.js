
import Image from "next/image";

export default function Card3({ pthumbLink, pname }) {
  return (
    <>
      <div
        className=
        {`
          w-[16vw]
          h-[20vw]
          rounded-[15px]
          bg-white
          border-1
          border-[var(--myBorderColor)]
          flex
          flex-col
        `}
      >
        <div
          className=
          {`
          w-[90%]
          h-[80%]
          mx-auto
          mt-3
          rounded-[10px]
          bg-[#fafafa]
          border-1
          border-[var(--myBorderColor)]
          flex
          items-center
          justify-center
        `}
        >
          <Image
            src={pthumbLink}
            alt={pname}
            width={1200}
            height={1200}

            priority
          />
        </div>
      </div>
    </>
  );
}