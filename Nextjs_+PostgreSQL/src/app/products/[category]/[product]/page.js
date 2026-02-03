"use client"
import { ArrowUpRight, ArrowRight, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Card2 from "@/components/Card2";
import TextAndPlus from "@/components/TextAndPlus";
import { useParams } from 'next/navigation';
import { useSelector } from "react-redux";
import { useAppContext } from "@/context/AppContext";
import { getDefaultVariant } from "@/utils/productVariant";
import OptionGroup from "@/components/OptionGroup";
import { buildOptionsFromVariantsByUnion } from "@/utils/buildOptionsFromVariantsByUnion";
import Card1 from "@/components/Card1";
import { useProducts } from "../layout";
import SmallCardsList from "@/components/SmallCardsList";

export default function Product() {
  const {
    isProductPageArrowDown1,
    setIsProductPageArrowDown1,
    isProductPageArrowDown2,
    setIsProductPageArrowDown2

  } = useAppContext();

  const allRelatedProducts = useProducts();

  const { category, product } = useParams();

  const selected_product = React.useMemo(() => {
    if (!allRelatedProducts.length || !product) return null;

    return allRelatedProducts.find(
      p => p.route === product
    ) || null;
  }, [allRelatedProducts, product]);

  const otherRelatedProducts = React.useMemo(() => {
    if (!allRelatedProducts || !selected_product) return [];
    return allRelatedProducts.filter(p => p.id !== selected_product.id);
  }, [allRelatedProducts, selected_product]);

  const availableOptions = React.useMemo(() => {
    if (!selected_product?.variants) return {}
    return buildOptionsFromVariantsByUnion(selected_product.variants)
  }, [selected_product])

  const [selectedOptions, setSelectedOptions] = useState({});

  const defaultVariant = getDefaultVariant(selected_product);

  useEffect(() => {
    if (!defaultVariant?.options) return
    setSelectedOptions({ ...defaultVariant.options })
  }, [defaultVariant])

  const matchedVariant = React.useMemo(() => {
    if (!selected_product?.variants) return null

    return selected_product.variants.find(variant =>
      Object.entries(selectedOptions).every(
        ([key, value]) => variant.options[key] === value
      )
    ) || null
  }, [selectedOptions, selected_product])

  const price = matchedVariant?.price
  const discount = matchedVariant?.discount ?? 0
  const finalPrice = matchedVariant
    ? price - Math.round((price * discount) / 100)
    : null


  if (!selected_product) {
    return (
      <main className="w-full flex items-center justify-center py-40">
        <p className="text-gray-400">Loading product…</p>
      </main>
    );
  }

  return (
    <>
      <main
        className=
        {`
            z-1
            relative
            w-full
            bg-white
            my-3
            lg:my-5
            flex
            flex-col
            gap-5
            items-center
          `}
      >
        <section
          className=
          {`
              w-full
            `}
        >
          <div
            className=
            {`
                flex flex-col
                lg:grid lg:grid-cols-[370px_1fr_370px] gap-6              
                mx-auto
              `}
          >
            <div>
              <div
                className=
                {`
                    lg:sticky lg:top-[35%]
                  `}
              >
                <Link
                  href={"/collections/" + selected_product.collection_id}
                  className=
                  {`
                      block
                    `}
                >
                  <h3
                    className=
                    {`
                        font-poppins
                        text-[var(--myTextColorLightGray)]
                        text-[105%]
                        font-bold
                        hover:text-black
                      `}
                  >
                    {
                      selected_product.collection_name
                    }
                  </h3>
                </Link>
                <h1
                  className=
                  {`
                      mt-3
                      w-full
                      font-poppins
                      text-black
                      text-[205%]
                      font-semibold
                    `}
                >
                  {
                    selected_product.name
                  }
                </h1>
                <p
                  className=
                  {`
                      mt-3
                      w-full
                      font-poppins
                      text-[90%]
                      `}
                >
                  {
                    selected_product.description
                  }
                </p>
                <hr
                  className=
                  {`
                      w-full
                      mt-5
                      border-t
                      border-[var(--myBorderColor)]
                    `}
                />
                <TextAndPlus id={1} title="Product Information" state={isProductPageArrowDown1} setState={setIsProductPageArrowDown1} />
                <div
                  className=
                  {`
                      overflow-hidden 
                      transition-all
                      duration-550
                      ease-in-out
                      
                      w-full
                      ${isProductPageArrowDown1 ? "h-[0px] pointer-events-none pb-0" : "pb-3 h-[160px]"}
                    `}
                >
                  <div
                    className=
                    {`
                        grid 
                        grid-cols-2 
                        gap-x-4
                        gap-y-4
                        text-black
                        font-poppins
                        text-[80%]
                        font-extrabold
                      `}
                  >
                    <div
                      className=
                      {`
                          flex
                          flex-col
                          
                        `}
                    >
                      Material
                      <div
                        className=
                        {`
                            text-[90%]
                            text-[var(--myTextColorNormal)]
                            font-bold
                          `}
                      >
                        {selected_product.info?.material}
                      </div>
                    </div>
                    <div
                      className=
                      {`
                          flex
                          flex-col
                        `}
                    >
                      Weight
                      <div
                        className=
                        {`
                            text-[90%]
                            text-[var(--myTextColorNormal)]
                            font-bold
                          `}
                      >
                        {selected_product.info?.weight}
                      </div>
                    </div>
                    <div
                      className=
                      {`
                          flex
                          flex-col
  
                        `}
                    >
                      Country of origin
                      <div
                        className=
                        {`
                            text-[90%]
                            text-[var(--myTextColorNormal)]
                            font-bold
                          `}
                      >
                        {selected_product.info?.country_of_origin}
                      </div>
                    </div>
                    <div
                      className=
                      {`
                          flex
                          flex-col
  
                        `}
                    >
                      Dimensions
                      <div
                        className=
                        {`
                            text-[90%]
                            text-[var(--myTextColorNormal)]
                            font-bold
                          `}
                      >
                        {selected_product.info?.dimensions}
                      </div>
                    </div>
                    <div
                      className=
                      {`
                          flex
                          flex-col
  
                        `}
                    >
                      Type
                      <div
                        className=
                        {`
                            text-[90%]
                            text-[var(--myTextColorNormal)]
                            font-bold
                          `}
                      >
                        {selected_product.info?.type}
                      </div>
                    </div>
                  </div>
                </div>
                <hr
                  className=
                  {`
                      w-full
                      border-t
                      border-[var(--myBorderColor)]
                    `}
                />
                <TextAndPlus id={2} title="Shipping & Returns" state={isProductPageArrowDown2} setState={setIsProductPageArrowDown2} />
                <hr
                  className=
                  {`
                      w-full
                      border-t
                      border-[var(--myBorderColor)]
                    `}
                />
              </div>
            </div>
            <div
              className=
              {`
                  flex
                  flex-col
                  gap-5
                `}
            >
              <Card2 productObj={selected_product} />
              <Card2 productObj={selected_product} />
              <Card2 productObj={selected_product} />
            </div>

            <div>
              <div
                className=
                {`
                     lg:sticky lg:top-[35%] flex justify-center
                  `}
              >

                <div className="w-full lg:w-[81%] flex flex-wrap lg:flex-nowrap lg:flex-col gap-y-5 gap-x-10 lg:gap-1">
                  {Object.entries(availableOptions).map(([label, values]) => (
                    <OptionGroup
                      key={label}
                      label={label}
                      values={values}
                      selectedValue={selectedOptions[label]}
                      onSelect={(key, value) =>
                        setSelectedOptions(prev => ({
                          ...prev,
                          [key]: value
                        }))
                      }
                    />
                  ))}

                  {/* {
                    matchedVariant &&
                    <div className="mb-4">
                      <p className="mb-2 font-semibold capitalize">
                        Available Stock
                      </p>

                      <div className="flex gap-2 flex-wrap">
                        {matchedVariant?.stock}
                      </div>
                    </div>
                  } */}

                  {
                    matchedVariant ?
                      <div className=
                        {`
                            w-full flex flex-col
                          `}
                      >

                        <div
                          className=
                          {`
                              w-full
                              flex
                              items-center
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
                                ${"text-black font-bold text-2xl"}
                              `}
                          >
                            {finalPrice}.00
                          </div>
                        </div>
                        <button className="w-full h-[36px] bg-[black] text-white cursor-pointer rounded-md">
                          Add to Cart
                        </button>
                      </div>
                      :
                      <div className=
                        {`
                            w-full flex flex-col
                          `}
                      >
                        <div className="w-full h-[36px] bg-[#fafafa] text-[var(--myTextColorLightGray)] flex items-center justify-center cursor-not-allowed rounded-md">
                          Out of stock
                        </div>
                      </div>
                  }
                </div>
              </div>
            </div>

          </div>
        </section>
        {
          otherRelatedProducts.length > 1 &&
          <section
            className=
            {`
              max-w-[1440px]
              w-full
            `}
          >
            <header>
              <h3 className="mt-20 text-center">
                Related Products
              </h3>
              <p className="mx-auto text-center text-3xl min-w-0 w-full max-w-[440px] mt-5">
                You might also want to check out these products.
              </p>
            </header>

            {/* products */}
            <SmallCardsList productList={otherRelatedProducts} className={""} />
          </section>
        }
      </main>
    </>
  );
}