
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { getVariantPricing } from "@/utils/productVariant";
import { convertTextStringToDashString } from "@/utils/utilities";
import { useSearchModal } from "@/context/SearchModalContext";

export default function Card1({ className, productObj, id }) {

  const { variant, price, discount, finalPrice } = getVariantPricing(productObj);
  const product_route = convertTextStringToDashString(productObj.name);
  const { closeSearchModal } = useSearchModal();
  const classes = "w-"
  return (
    <>
      <Link
        key={id}
        onClick={() => {
          closeSearchModal();
        }}
        href={"/products/" + String(productObj.category) + "/" + product_route}
        className=
        {`
          w-full
          text-myTextColorMain
          group
        `}
      >
        <article
          className=
          {`
            w-full
            h-[63vw]
            lg:h-[42vw]
            max-h-[610px] 
            flex
            flex-col
            ${className}
          `}
        >
          <div
            className=
            {`
              w-full
              h-full
              rounded-[12px]
              bg-background_2
              border
              border-myBorderColor
              transition-all
              duration-150
              hover:shadow-foreground/20
              hover:shadow-md
              flex
              items-center
              justify-center
              overflow-hidden
            `}
          >
            <Image
              className="scale-100 group-hover:scale-120 transition-normal duration-100"
              src={variant?.images[0]["src"]}
              alt={productObj.name}
              width={1200}
              height={1200}
              priority
            />
          </div>
          <div
            className=
            {`
              relative
              flex
              mt-3
              w-full
              text-[95%]
              font-semibold
              reverse
            `}
          >
            <div
              className=
              {`
                wrap-break-words
                w-full
                whitespace-normal
              `}
            >
              {productObj.name}
            </div>
            <div
              className=
              {`
                flex
                justify-end
                flex-wrap
                text-right
              `}
            >
              {
                discount > 0 &&
                <div
                  className=
                  {`
                    ml-3
                    line-through
                  `}
                >
                  {price}
                </div>
              }
              <div
                className=
                {`
                  ml-3
                  ${discount > 0 && "text-[var(--myTextColorBlue)]"}
                `}
              >
                {finalPrice}
              </div>
            </div>

          </div>
        </article>
      </Link>
    </>
  );
}