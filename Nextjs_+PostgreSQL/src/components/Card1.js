
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useDispatch } from 'react-redux';
import { setMedusaSelectedProduct } from '@/store/medusaselectedproductSlice';

import { getVariantPricing } from "@/utils/productVariant";

export default function Card1({ className, productObj, id }) {
  const dispatch = useDispatch();

  const { price, discount, finalPrice } =
    getVariantPricing(productObj);

  return (
    <>
      <Link
        key={id}
        onClick={() => {
          window.scrollTo(0, 0); // scroll to top immediately
          dispatch(setMedusaSelectedProduct(productObj))
        }}
        href={"/products/" + String(productObj.category + "/" + String(productObj.route))}
        className=
        {`
          w-[100%]
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
              bg-[#fafafa]
              border-1
              border-[var(--myBorderColor)]
              transition-all
              duration-150
              hover:shadow-sm
              flex
              items-center
              justify-center
              overflow-hidden
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
          <div
            className=
            {`
              relative
              flex
              mt-3
              w-full
              text-[95%]
              text-[var(--myTextColorNormal)]
              font-semibold
              reverse
            `}
          >
            <div
              className=
              {`
                break-words
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