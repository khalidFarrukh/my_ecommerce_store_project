
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { getDefaultVariantPricing } from "@/utils/productVariant";
import { convertTextStringToDashString } from "@/utils/utilities";
import { useSearchModal } from "@/context/SearchModalContext";

export default function Card1({ className, productObj, id }) {

  const { variant, price, discount, finalPrice } = getDefaultVariantPricing(productObj);
  const product_route = convertTextStringToDashString(productObj.name);
  const { closeSearchModal } = useSearchModal();
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
              gap-2
            `}
          >
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">4.5</span>
              </div>
              <div
                className=
                {`
                  
                  w-full
                  whitespace-normal
                  line-clamp-2
                `}
              >
                {productObj.name}
              </div>
            </div>
            <div
              className=
              {`
                flex
                justify-end
                text-right
              `}
            >
              <div className=" flex flex-col gap-2">

                {
                  discount > 0 &&
                  <div
                    className=
                    {`
                      
                    text-nowrap                  
                    line-through
                    text-sm
                  `}
                  >
                    Rs. {price}
                  </div>
                }
                <div
                  className=
                  {`

                    text-nowrap
                  ${discount > 0 && "text-[var(--myTextColorBlue)]"}
                `}
                >
                  Rs. {finalPrice}
                </div>
              </div>
            </div>

          </div>
        </article>
      </Link>
    </>
  );
}