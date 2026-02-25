"use client"
import { ArrowUpRight, ArrowRight, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Card2 from "@/components/Card2";
import TextAndPlus from "@/components/TextAndPlus";
import { useParams } from 'next/navigation';
import { useSelector } from "react-redux";
import { useProductPageContext } from "@/context/ProductPageContext";
import { getDefaultVariant } from "@/utils/productVariant";
import OptionGroup from "@/components/OptionGroup";
import { buildOptionsFromVariantsByUnion } from "@/utils/buildOptionsFromVariantsByUnion";
import Card1 from "@/components/Card1";
import SmallCardsList from "@/components/SmallCardsList";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { useAlertModal } from "@/context/AlertModalContext";
import { convertDashStringToTextString } from "@/utils/utilities";

export default function ProductClient({ selectedProduct, relatedProducts }) {
  const {
    isProductPageArrowDown1,
    setIsProductPageArrowDown1,
    isProductPageArrowDown2,
    setIsProductPageArrowDown2
  } = useProductPageContext();


  const dispatch = useDispatch();
  const { openAlertModal } = useAlertModal();
  const cartItems = useSelector(state => state.cart.cartState.items); // assuming your slice is cart.items
  const [selected_quantity, setSelectedQuantity] = useState(1);

  const selected_product = selectedProduct;
  const otherRelatedProducts = relatedProducts;


  const availableOptions = React.useMemo(() => {
    if (!selected_product?.variants) return {}
    return buildOptionsFromVariantsByUnion(selected_product.variants)
  }, [selected_product])

  const [selectedOptions, setSelectedOptions] = useState({});

  const defaultVariant = getDefaultVariant(selected_product);


  const matchedVariant = React.useMemo(() => {
    if (!selected_product?.variants) return null;

    return selected_product.variants.find(variant =>
      Object.entries(selectedOptions).every(
        ([key, value]) => variant.options[key] === value
      )
    ) || null;
  }, [selectedOptions, selected_product]);

  useEffect(() => {
    if (!defaultVariant?.options) return
    setSelectedOptions({ ...defaultVariant.options })
  }, [defaultVariant])

  useEffect(() => {
    setSelectedQuantity(1);
  }, [matchedVariant]);

  const increaseQty = () => {
    if (!matchedVariant) return;
    if (selected_quantity >= 3) return;

    setSelectedQuantity(prev => prev + 1);
  };

  const decreaseQty = () => {
    if (selected_quantity <= 1) return;

    setSelectedQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selected_product || !matchedVariant) return;

    const cartItem = {
      product_id: selected_product._id,
      variant_id: matchedVariant.id,
      quantity: selected_quantity
    };

    // Check if this product+variant already exists in cart
    const existingMainProductIndex = cartItems.findIndex(
      item => item.product_id === cartItem.product_id
    );

    if (existingMainProductIndex === -1) {
      // Not in cart → simply add
      dispatch(addToCart({ ...cartItem }));
    } else {
      const existingMainProduct = cartItems[existingMainProductIndex];

      const existingVariantIndex = existingMainProduct.variants.findIndex(
        variant => variant.variant_id === cartItem.variant_id
      );

      if (existingVariantIndex === -1) {
        dispatch(addToCart({ ...cartItem }));
      }
      else {
        const existingVariant = existingMainProduct.variants[existingVariantIndex];
        // Sum quantities
        const newQuantity = existingVariant.quantity + cartItem.quantity;
        if (newQuantity <= 3) {
          // Update quantity in cart slice
          dispatch(addToCart({ ...cartItem }));
        } else {
          openAlertModal(
            "Same product must not exceed the max limit of 3 in cart. Your current action causes the cart for this product to go beyond max limit of 3."
          );
        }
      }

    }
  };

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
            relative
            w-full
            bg-background_1
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
                {
                  selected_product.collectionIds.map((collectionId, index) => (
                    <Link
                      key={index}
                      href={"/collections/" + collectionId}
                      className=
                      {`
                      block
                    `}
                    >
                      <h3
                        className=
                        {`
                      text-myTextColorLightGray
                      text-[105%]
                      font-bold
                      hover:text-foreground
                    `}
                      >
                        {convertDashStringToTextString(collectionId)}
                      </h3>
                    </Link>
                  ))
                }
                <h1
                  className=
                  {`
                      mt-3
                      w-full
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
                      border-myBorderColor
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
                      ${isProductPageArrowDown1 ? "h-0 pointer-events-none pb-0" : "pb-3 h-[160px]"}
                    `}
                >
                  <div
                    className=
                    {`
                        grid 
                        grid-cols-2 
                        gap-x-4
                        gap-y-4
                       
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
                      border-myBorderColor
                    `}
                />
                <TextAndPlus id={2} title="Shipping & Returns" state={isProductPageArrowDown2} setState={setIsProductPageArrowDown2} />
                <hr
                  className=
                  {`
                      w-full
                      border-t
                      border-myBorderColor
                    `}
                />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {
                matchedVariant?.images?.map((image, index) => (
                  <div
                    key={`${matchedVariant.id}-${index}`}
                    className="
                    flex-1
                    w-full
                    h-full
                    rounded-[12px]
                    bg-background_2
                    border
                    border-myBorderColor
                    flex
                    items-center
                    justify-center
                  
                  "
                  >
                    <Image

                      src={image?.src}
                      alt={selected_product.name}
                      width={1200}
                      height={1200}
                      priority
                    />
                  </div>
                ))
              }
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

                  {
                    matchedVariant && matchedVariant?.stock < 10 &&
                    <div className="mb-4">
                      <p className="mb-2 font-semibold capitalize">
                        Available Stock
                      </p>
                      {matchedVariant?.stock}
                    </div>
                  }

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
                                font-bold 
                                text-2xl
                             
                              `}
                          >
                            {finalPrice}.00
                          </div>
                        </div>
                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between mb-3">

                          <p className="font-semibold">Quantity</p>

                          <div className="flex items-center overflow-hidden">

                            <button
                              onClick={decreaseQty}
                              disabled={selected_quantity === 1}
                              className="px-3 py-1 inc_dec cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>

                            <div className="px-4 bg-background_1">
                              {selected_quantity}
                            </div>

                            <button
                              onClick={increaseQty}
                              disabled={selected_quantity === 3}
                              className="px-3 py-1 inc_dec cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>

                          </div>
                        </div>

                        <button
                          onClick={handleAddToCart}
                          className="w-full h-[36px] border button2 cursor-pointer rounded-md"
                        >
                          Add to Cart
                        </button>

                      </div>
                      :
                      <div className=
                        {`
                            w-full flex flex-col
                          `}
                      >
                        <div className="w-full h-[36px] bg-background_2 text-[var(--myTextColorLightGray)] flex items-center justify-center cursor-not-allowed rounded-md">
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
            <SmallCardsList
              productList={otherRelatedProducts}
              className={`
                grid
                grid-cols-2
                lg:grid-cols-4
                mt-5
                gap-x-5
                gap-y-5
                w-full
                `}
              card1_className={"!min-h-[300px] !h-[15vw] !lg:h-[15vw]"}
            />
          </section>
        }
      </main>
    </>
  );
}