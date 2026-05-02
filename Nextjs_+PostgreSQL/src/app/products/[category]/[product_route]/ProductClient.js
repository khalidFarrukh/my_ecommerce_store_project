"use client"
import { ArrowUpRight, ArrowRight, Plus } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
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
import { convertDashStringToTextString, handleTextareInput } from "@/utils/utilities";
import { useWindowSizeContext } from "@/context/WindowSizeContext";
import NotFound from "@/components/NotFound";

export function useDynamicSticky(ref) {
  const [topValue, setTopValue] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const updateTop = () => {
      if (window.innerWidth < 1024) return;

      const divHeight = element.offsetHeight;
      const screenHeight = window.innerHeight;

      const calculatedTop = Math.max(
        (screenHeight - divHeight) / 2,
        20 // prevent going off screen
      );

      setTopValue(calculatedTop);
    };

    // Initial run
    updateTop();

    // Observe height changes
    const resizeObserver = new ResizeObserver(updateTop);
    resizeObserver.observe(element);

    // Window resize
    window.addEventListener("resize", updateTop);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTop);
    };
  }, [ref]);

  return topValue;
}

function getValidOptions(variants, selectedOptions) {
  const result = {};

  variants.forEach(variant => {
    variant.options.forEach(option => {
      const optionName = option.name;

      // Check match ignoring this option group
      const isMatch = Object.entries(selectedOptions).every(([key, value]) => {
        if (key === optionName) return true; // 👈 ignore self
        return variant.options.some(
          opt => opt.name === key && opt.value === value
        );
      });

      if (isMatch) {
        if (!result[optionName]) {
          result[optionName] = new Set();
        }
        result[optionName].add(option.value);
      }
    });
  });

  return Object.fromEntries(
    Object.entries(result).map(([key, set]) => [key, [...set]])
  );
}

export default function ProductClient({ selectedProduct, relatedProducts }) {
  const {
    isProductPageArrowDown1,
    setIsProductPageArrowDown1,
    isProductPageArrowDown2,
    setIsProductPageArrowDown2
  } = useProductPageContext();

  const { windowWidth } = useWindowSizeContext();
  const dispatch = useDispatch();
  const { openAlertModal } = useAlertModal();
  const cartItems = useSelector(state => state.cart.cartState.items); // assuming your slice is cart.items
  const [selected_quantity, setSelectedQuantity] = useState(1);
  const leftStickyRef = useRef(null);
  const rightStickyRef = useRef(null);

  const leftTop = useDynamicSticky(leftStickyRef);
  const rightTop = useDynamicSticky(rightStickyRef);

  const [activeCommentSectionTab, setActiveCommentSectionTab] = useState("reviews");

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

    return (
      selected_product.variants.find(variant =>
        Object.entries(selectedOptions).every(([key, value]) =>
          variant.options.some(
            option => option.name === key && option.value === value
          )
        )
      ) || null
    );
  }, [selectedOptions, selected_product]);

  const validOptions = React.useMemo(() => {
    return getValidOptions(selected_product.variants, selectedOptions);
  }, [selectedOptions, selected_product]);

  useEffect(() => {
    if (!defaultVariant?.options) return;

    const optionsObj = defaultVariant.options.reduce((acc, option) => {
      acc[option.name] = option.value;
      return acc;
    }, {});

    setSelectedOptions(optionsObj);

  }, [defaultVariant]);

  const commentsTextareaRef = useRef(null);

  // optional: initialize height if textarea has default value
  useEffect(() => {
    handleTextareInput(commentsTextareaRef);
  }, []);

  const images = matchedVariant?.images || [];
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setSelectedQuantity(1);
    setActiveImage(0);
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

  // if (!selected_product) {
  //   return (
  //     <div className="w-full flex items-center justify-center py-40">
  //       <p className="text-gray-400">Loading product…</p>
  //     </div>
  //   );
  // }


  return (
    <>
      <div
        className={`relative w-full bg-background_1 my-3 lg:my-5 flex flex-col gap-5 items-center`}
      >
        <section className="w-full space-y-3">
          {
            windowWidth < 1024 &&
            <div className="space-y-3">
              {
                selected_product.collectionIds.map((collectionId, index) => (
                  <Link
                    key={index}
                    href={"/collections/" + collectionId}
                    className="block"
                  >
                    <h3 className="text-myTextColorLightGray text-base font-bold hover:text-foreground">
                      {convertDashStringToTextString(collectionId)}
                    </h3>
                  </Link>
                ))
              }

              < h1 className="w-full text-4xl font-semibold">
                {selected_product.name}
              </h1>

              <p className="w-full text-sm line-clamp-2">
                {selected_product.description}
              </p>
            </div>
          }
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[270px_1fr_270px] xl:grid-cols-[370px_1fr_370px] gap-6 mx-auto`}
          >
            {/* LEFT COLUMN (info) */}
            <div
              className="order-3 lg:order-1 col-span-1 sm:col-span-2 lg:col-span-1"
            >
              <div
                ref={leftStickyRef}
                className="lg:sticky"
                style={{ top: `${leftTop}px` }}
              >
                {
                  windowWidth >= 1024 &&
                  <>
                    {
                      selected_product.collectionIds.map((collectionId, index) => (
                        <Link
                          key={index}
                          href={"/collections/" + collectionId}
                          className="block"
                        >
                          <h3 className="text-myTextColorLightGray text-base font-bold hover:text-foreground">
                            {convertDashStringToTextString(collectionId)}
                          </h3>
                        </Link>
                      ))
                    }

                    < h1 className="mt-3 w-full text-4xl font-semibold">
                      {selected_product.name}
                    </h1>

                    <p className="mt-3 w-full text-sm">
                      {selected_product.description}
                    </p>
                  </>
                }
                <hr className="w-full mt-5 border-t border-myBorderColor" />

                <TextAndPlus
                  id={1}
                  title="Product Information"
                  state={isProductPageArrowDown1}
                  setState={setIsProductPageArrowDown1}
                />

                <div
                  className={`overflow-hidden transition-all duration-500 w-full ${isProductPageArrowDown1 ? "h-0 pb-0" : "pb-3 h-[160px]"}`}
                >
                  <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                    <div>
                      Material
                      <div className="text-xs font-semibold">
                        {selected_product.info?.material}
                      </div>
                    </div>

                    <div>
                      Weight
                      <div className="text-xs font-semibold">
                        {selected_product.info?.weight}
                      </div>
                    </div>

                    <div>
                      Country
                      <div className="text-xs font-semibold">
                        {selected_product.info?.country_of_origin}
                      </div>
                    </div>

                    <div>
                      Dimensions
                      <div className="text-xs font-semibold">
                        {selected_product.info?.dimensions}
                      </div>
                    </div>

                    <div>
                      Type
                      <div className="text-xs font-semibold">
                        {selected_product.info?.type}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="w-full border-t border-myBorderColor" />

                <TextAndPlus
                  id={2}
                  title="Shipping & Returns"
                  state={isProductPageArrowDown2}
                  setState={setIsProductPageArrowDown2}
                />

                <hr className="w-full border-t border-myBorderColor" />
              </div>
            </div>

            {/* MIDDLE COLUMN (images) */}
            <div
              className="order-1 lg:order-2 col-span-1"
            >
              <div className="flex flex-col gap-5">

                {/* ✅ Desktop: stacked images */}
                <div className="hidden lg:flex flex-col gap-5">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="w-full rounded-[12px] bg-background_2 border border-myBorderColor flex items-center justify-center"
                    >
                      <Image
                        src={image.src}
                        alt={selected_product.name}
                        width={1200}
                        height={1200}
                        priority
                      />
                    </div>
                  ))}
                </div>

                {/* ✅ Mobile + Tablet: gallery */}
                <div className="lg:hidden flex flex-col gap-3 w-full sm:h-[50vw]  overflow-hidden">

                  {/* Main Image */}
                  {images[activeImage] && (
                    <div className=" h-[calc(100vw-10px)] w375:h-[calc(100vw-20px)] w-auto sm:h-[75%] rounded-[12px] bg-background_2 border border-myBorderColor overflow-hidden flex items-center justify-center">
                      <Image
                        src={images[activeImage].src}
                        alt={selected_product.name}
                        width={1200}
                        height={1200}
                        priority
                      />
                    </div>
                  )}

                  {/* Thumbnails */}
                  <div className="sm:h-16 w-full space-x-2 scrollbar-hide overflow-x-auto overflow-y-clip">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImage(i)}
                        onMouseEnter={() => setActiveImage(i)}
                        className={`
                          w-16
                          h-16
                          rounded
                          cursor-pointer
                          flex items-center justify-center
                          ${i === activeImage
                            ? "bg-background_2 border border-foreground"
                            : "bg-background_3 border border-myBorderColor"}
                          `}
                      >
                        <Image
                          className="overflow-hidden"
                          src={img.src}
                          alt={img.alt}
                          width={64}
                          height={64}
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN (buy box) */}
            <div
              className={`order-2 lg:order-3 col-span-1 ${windowWidth > 639 && windowWidth < 1024 ? "min-h-[50vw] flex items-center" : ""}`}
            >
              <div
                ref={rightStickyRef}
                className="lg:sticky w-full flex justify-center"
                style={{ top: `${rightTop}px` }}
              >
                <div className="w-full flex flex-wrap lg:flex-nowrap lg:flex-col gap-y-5 gap-x-10 lg:gap-1">

                  {Object.entries(availableOptions).map(([label, values]) => (
                    <OptionGroup
                      key={label}
                      label={label}
                      values={values}
                      selectedValue={selectedOptions[label]}
                      validValues={validOptions[label] || []}
                      onSelect={(key, value) =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [key]: value,
                        }))
                      }
                    />
                  ))}

                  {matchedVariant && matchedVariant?.stock < 10 && (
                    <div>
                      <p className="font-semibold">Available Stock</p>
                      {matchedVariant.stock}
                    </div>
                  )}

                  {matchedVariant ? (
                    <div
                      className={`
                            w-full flex flex-col gap-5
                          `}
                    >
                      <div
                        className={`
                              w-full
                              flex
                              items-center
                            `}
                      >
                        {discount > 0 && (
                          <div className="line-through">{price}</div>
                        )}
                        <div className="ml-3 font-bold text-2xl">
                          {finalPrice}.00
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between">
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

                      {/* CTA */}
                      <button
                        onClick={handleAddToCart}
                        className="w-full h-9 border button1 cursor-pointer rounded-md"
                      >
                        Add to Cart
                      </button>

                    </div>
                  ) : (
                    <div className="w-full h-9 bg-background_2 text-(--myTextColorLightGray) flex items-center justify-center cursor-not-allowed rounded-md">
                      Out of stock
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div >
        </section >

        {/* ✅ COMMENTS SECTION (UPDATED WITH TABS) */}
        <section
          className="w-full mt-10"
        >
          {/* Tabs */}
          <div className="flex justify-center gap-5 mb-8">
            <button
              onClick={() => setActiveCommentSectionTab("reviews")}
              className={`px-4 py-2 cursor-pointer border rounded-md ${activeCommentSectionTab === "reviews" ? "button1_active" : "button1"}`}
            >
              Reviews
            </button>

            <button
              onClick={() => setActiveCommentSectionTab("qa")}
              className={`px-4 py-2 cursor-pointer border rounded-md ${activeCommentSectionTab === "qa" ? "button1_active" : "button1"}`}
            >
              Q&A
            </button>
          </div>

          {/* ================= REVIEWS TAB ================= */}
          {activeCommentSectionTab === "reviews" && (
            <>
              <header className="mb-5">
                <h3 className="text-center">Customer Reviews</h3>
                <p className="mx-auto text-center text-3xl min-w-0 w-full max-w-[440px] mt-3">
                  See what others are saying about this product.
                </p>
              </header>

              {/* ❌ NO textarea here */}

              {/* Reviews List */}
              <div className="flex flex-col gap-5 max-w-[700px] mx-auto">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="w-full border border-myBorderColor rounded-md p-4 bg-background_2"
                  >
                    <p className="font-semibold">User {item}</p>
                    <p className="text-sm mt-2 text-myTextColorLightGray">
                      This is a sample review. You can replace this with real data from your database.
                    </p>

                    {/* Admin Reply */}
                    <div className="mt-3 ml-4 p-3 border-l border-myBorderColor">
                      <p className="font-semibold">YourStore (Official)</p>
                      <p className="text-sm text-myTextColorLightGray">
                        Thanks for your feedback!
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= Q&A TAB ================= */}
          {activeCommentSectionTab === "qa" && (
            <>
              <header className="mb-5">
                <h3 className="text-center">Questions & Answers</h3>
                <p className="mx-auto text-center text-3xl min-w-0 w-full max-w-[440px] mt-3">
                  Ask anything about this product.
                </p>
              </header>

              {/* ✅ Q&A Input */}
              <div className="w-full max-w-[600px] mx-auto mb-8">
                <textarea
                  ref={commentsTextareaRef}
                  placeholder="Ask a question..."
                  className="w-full border border-myBorderColor rounded-md p-3 bg-background_2 outline-none resize-none overflow-hidden"
                  rows={1}
                  onChange={() => handleTextareInput(commentsTextareaRef)}
                />
                <button className="mt-3 px-5 py-2 border button1 rounded-md">
                  Submit Question
                </button>
              </div>

              {/* Q&A List */}
              <div className="flex flex-col gap-5 max-w-[700px] mx-auto">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="w-full border border-myBorderColor rounded-md p-4 bg-background_2"
                  >
                    <p className="font-semibold">User {item}</p>
                    <p className="text-sm mt-2 text-myTextColorLightGray">
                      Is this product durable for long-term use?
                    </p>

                    {/* Admin Answer */}
                    <div className="mt-3 ml-4 p-3 border-l border-myBorderColor">
                      <p className="font-semibold">YourStore (Official)</p>
                      <p className="text-sm text-myTextColorLightGray">
                        Yes, it is designed for long-term durability.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {
          otherRelatedProducts.length > 0 && (
            <section
              className={`
              
              w-full
            `}
            >
              <header>
                <h3 className="mt-20 text-center">Related Products</h3>
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
          )
        }
      </div >
    </>
  );
}