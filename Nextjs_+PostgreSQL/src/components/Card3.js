
import { useSearchModal } from "@/context/SearchModalContext";
import { getDefaultVariant } from "@/utils/productVariant";
import Image from "next/image";
import Link from "next/link";

export default function Card3({ productObj, id }) {
  const { closeSearchModal } = useSearchModal();
  const defaultVariant = getDefaultVariant(productObj);
  return (
    <>
      <Link
        href={"/products/" + String(productObj.category + "/" + String(productObj.route))}
        onClick={closeSearchModal}
        className=
        {`
          w-fit
          h-fit
          rounded-[15px]
          bg-background_2
          border
          border-myBorderColor
          flex
          flex-col
          gap-3
          p-5
          pb-3
          m-3
          group
        `}
      >
        <div
          className=
          {`
          size-full          
          rounded-[10px]
          bg-background_2
          border
          border-myBorderColor
          flex
          items-center
          justify-center
        `}
        >
          <Image
            className="scale-100 group-hover:scale-120 transition-normal duration-100"
            src={defaultVariant.images[0]["src"]}
            alt={productObj.name}
            width={1200}
            height={1200}

            priority
          />
        </div>
        <div className="w-full">
          {productObj.name}
        </div>
      </Link>
    </>
  );
}