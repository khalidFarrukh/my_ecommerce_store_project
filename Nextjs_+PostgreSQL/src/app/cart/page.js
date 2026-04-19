"use client"
import { Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Card1 from "@/components/Card1";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import { collections } from "@/app/api/data";
import { getVariantPricing } from "@/utils/productVariant";
import { useRef } from "react";
import SmallCardsList from "@/components/SmallCardsList";
import { useDispatch } from "react-redux";
import { updateCartVariantQuantity, updateVariantCheckBox, updateProductCheckBox, updateAllItemCheckBox, deleteVariant, deleteProduct, deleteAllItems } from "@/store/cartSlice"
import { getShippingPrice } from "@/utils/shipping";
import Image from "next/image";
import YesNoModal from "@/components/modals/YesNoModal";
import { convertTextStringToDashString, parseDimensions, parseWeight } from "@/utils/utilities";


export default function Cart() {
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [currentCartProductIndex, setCurrentCartProductIndex] = useState(-99);
  const [currentCartVariantIndex, setCurrentCartVariantIndex] = useState(-99);

  const dispatch = useDispatch();
  const cartState = useSelector(state => state.cart.cartState);
  const router = useRouter();

  const cartItemsSize = React.useMemo(() => {
    let variantCount = 0;
    cartState.items.forEach(product => {
      variantCount += product.variants.length;
    });
    return variantCount;
  }, [cartState]);

  const [cartProductsData, setCartProductsData] = useState([]);

  useEffect(() => {
    if (!cartState.items.length) return;

    const fetchProducts = async () => {
      const res = await fetch("/api/products/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: cartState.items.map(i => i.product_id)
        })
      });

      const data = await res.json();
      setCartProductsData(data);
    };

    fetchProducts();
  }, [cartState.items]);

  const [activeVariantsSize, setActiveVariantsSize] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  useEffect(() => {
    if (!cartProductsData.length) {
      setActiveVariantsSize(0);
      setSubTotal(0);
      setShippingFee(0);
      return;
    };

    let count = 0;
    let subTotalCount = 0;
    let totalChargeableWeight = 0;

    cartState.items.forEach((product, pIndex) => {
      product.variants.forEach((variant, vIndex) => {
        if (variant.active) {
          const cartProductByFetch = cartProductsData.find(
            p => p._id === product.product_id
          );

          const cartVariantByFetch = cartProductByFetch.variants.find(
            v => v.id === variant.variant_id
          );
          const { wasting, price, discount, finalPrice } = getVariantPricing(cartVariantByFetch);

          subTotalCount += finalPrice * variant.quantity;
          count++;

          const weight = parseWeight(cartProductByFetch.info.weight);
          const [l, w, h] = parseDimensions(cartProductByFetch.info.dimensions);
          let volumetricWeight = 0;
          if (l && w && h) {
            volumetricWeight = (l * w * h) / 5000;
          }
          const chargeableWeight = Math.max(weight, volumetricWeight);
          totalChargeableWeight += chargeableWeight * variant.quantity;
        }
      });
    });

    const shippingFee = getShippingPrice(totalChargeableWeight);
    setActiveVariantsSize(count);
    setSubTotal(subTotalCount);
    setShippingFee(shippingFee);
  }, [cartProductsData, cartState]);

  const increaseQty = (cpi, cvi) => {
    const product_id = cartState.items[cpi].product_id;
    const variant_id = cartState.items[cpi].variants[cvi].variant_id;
    const quantity = cartState.items[cpi].variants[cvi].quantity;
    if (quantity >= 3) return;

    const updateCartItem = {
      product_id: product_id,
      variant_id: variant_id,
      quantity: quantity + 1
    }
    dispatch(updateCartVariantQuantity(updateCartItem))
  };

  const decreaseQty = (cpi, cvi) => {
    const product_id = cartState.items[cpi].product_id;
    const variant_id = cartState.items[cpi].variants[cvi].variant_id;
    const quantity = cartState.items[cpi].variants[cvi].quantity;
    if (quantity <= 1) return;

    const updateCartItem = {
      product_id: product_id,
      variant_id: variant_id,
      quantity: quantity - 1
    }
    dispatch(updateCartVariantQuantity(updateCartItem))
  };

  const handleVariantCheckBox = (cartProductIndex, cartVariantIndex) => {
    const product_id = cartState.items[cartProductIndex].product_id;
    const variant_id = cartState.items[cartProductIndex].variants[cartVariantIndex].variant_id;
    const updateCartItem = {
      product_id: product_id,
      variant_id: variant_id
    }
    dispatch(updateVariantCheckBox(updateCartItem))
  }
  const handleProductCheckBox = (cartProductIndex) => {
    const product_id = cartState.items[cartProductIndex].product_id;
    const updateCartItem = {
      product_id: product_id
    }
    dispatch(updateProductCheckBox(updateCartItem))
  }

  const handleVariantDelete = (cartProductIndex, cartVariantIndex) => {
    const send = {
      cartProductIndex, cartVariantIndex
    }
    dispatch(deleteVariant(send));
  }

  const handleProductDelete = (cartProductIndex) => {
    const send = {
      cartProductIndex
    }
    dispatch(deleteProduct(send));
  }

  const hasStockIssue = React.useMemo(() => {
    if (!cartProductsData.length) return;
    return cartState.items.some((cartProduct) => {
      const cartProductByFetch = cartProductsData.find((p) => p._id === cartProduct.product_id);
      return cartProduct.variants.some((cartVariant) => {
        const cartVariantByFetch = cartProductByFetch.variants.find((v) => v.id === cartVariant.variant_id);
        return cartVariant.quantity > cartVariantByFetch.stock;
      })
    });
  }, [cartState.items, cartProductsData]);

  if (!cartProductsData.length) {
    return <div className="absolute w-screen h-screen left-0 top-0 flex items-center justify-center">Loading</div>
  }
  return (

    <div
      className=
      {`
          relative
          w-full
          min-h-screen
          bg-background_1
          mb-3
          flex
          flex-col
          items-center
        `}
    >
      <div
        className=
        {`
            w-full
            h-full
            flex
            flex-col
            gap-3
          `}
      >
        {
          cartState.items.length > 0 ?
            <>
              <h1 className="text-[30px] mt-3 font-bold">Cart</h1>

              {hasStockIssue && (
                <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4">
                  <p className="text-sm text-yellow-700">
                    Please note that some items in your cart have less stock than your selected quantity. you wouldn't be able to proceed to checkout these items until you reduce the quantity to match the available stock. We apologize for any inconvenience caused and appreciate your understanding.
                  </p>
                </div>
              )}
              <div className="w-full flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex flex-col gap-3">

                  <div className="w-full flex gap-3 items-center justify-between">
                    <div className="flex gap-3">
                      <input className="size-[20px] cursor-pointer accent-foreground" type="checkbox" checked={cartState.active} onChange={() => dispatch(updateAllItemCheckBox())} />
                      <div> All Items</div>
                    </div>
                    <button
                      onClick={() => setShowDeleteAllModal(true)}
                      className="bg-[darkred] not-disabled:hover:bg-[red] p-2 rounded-md text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex gap-1"
                    ><Trash className="size-[20px]" /> Delete all</button>
                  </div>
                  <div className="w-full flex flex-col gap-3">

                    {cartState.items.map((cartProduct, cartProductIndex) => {
                      const cartProductByFetch = cartProductsData.find((p) => p._id === cartProduct.product_id);

                      return (

                        <div key={cartProductByFetch._id} className="rounded-[12px] bg-background_2 border border-myBorderColor py-4 px-5 flex flex-col gap-6 lg:gap-3">

                          {cartProduct.variants.map((cartVariant, cartVariantIndex) => {
                            const cartVariantByFetch = cartProductByFetch.variants.find((v) => v.id === cartVariant.variant_id);
                            const { wasting, price, discount, finalPrice } = getVariantPricing(cartVariantByFetch);
                            return (
                              <React.Fragment key={cartVariantByFetch.id}>
                                <div
                                  className="flex md:items-center gap-2 lg:gap-4 justify-between"
                                >
                                  <input className="min-w-[20px] min-h-[20px] size-[20px] cursor-pointer accent-foreground" type="checkbox" checked={cartVariant.active} onChange={() => handleVariantCheckBox(cartProductIndex, cartVariantIndex)} />
                                  <div className="flex flex-row items-center justify-center gap-4 flex-wrap">

                                    <Link
                                      href={`/products/${cartProductByFetch.category}/${convertTextStringToDashString(cartProductByFetch.name)}`}
                                    >
                                      <Image
                                        src={cartVariantByFetch.images[0]["src"]}
                                        alt={cartProductByFetch.name}
                                        className="mx-auto min-w-0 min-h-0 size-[120px] w375:size-[200px] md:size-[300px] lg:size-[150px]"
                                        width={1200}
                                        height={1200}
                                        priority
                                      />
                                    </Link>

                                    <div className="flex justify-center items-center flex-row flex-wrap gap-4">

                                      <Link
                                        href={`/products/${cartProductByFetch.category}/${convertTextStringToDashString(cartProductByFetch.name)}`}
                                        className="w-[180px] w375:w-[200px] flex flex-col"
                                      >
                                        <h2 className="font-bold text-base w375:text-lg truncate">
                                          {cartProductByFetch.name}
                                        </h2>
                                        {cartVariantByFetch.options.map((option) => (
                                          <div key={option.id} className="truncate">
                                            {option.name}: {option.value}
                                          </div>
                                        ))}
                                      </Link>

                                      <div className="flex flex-wrap items-center gap-4 justify-center">

                                        <div className="flex gap-2 items-center">
                                          {discount > 0 && (

                                            <div className="line-through">
                                              {price}
                                            </div>
                                          )}
                                          <div className=" font-bold text-2xl ">{finalPrice}</div>

                                        </div>

                                        <div className="flex flex-col gap-2 items-center justify-between">
                                          <div className="flex items-center overflow-hidden">
                                            <button
                                              onClick={() => decreaseQty(cartProductIndex, cartVariantIndex)}
                                              disabled={cartVariant.quantity === 1}
                                              className="px-3 py-1 inc_dec_2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              -
                                            </button>

                                            <div className="w-8 text-center">
                                              {cartVariant.quantity}
                                            </div>

                                            <button
                                              onClick={() => increaseQty(cartProductIndex, cartVariantIndex)}
                                              disabled={cartVariant.quantity === 3}
                                              className="px-3 py-1 inc_dec_2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              +
                                            </button>
                                          </div>

                                          {cartVariant.quantity > cartVariantByFetch.stock && (
                                            <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                              <span className="mt-[-5px]">⚠️</span>
                                              Only {cartVariantByFetch.stock} available
                                            </div>
                                          )}
                                        </div>

                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex w-max h-fit ">
                                    <button
                                      onClick={() => {
                                        setCurrentCartProductIndex(cartProductIndex);
                                        setCurrentCartVariantIndex(cartVariantIndex);
                                        setShowDeleteItemModal(true);
                                      }}
                                      className="bg-[darkred] not-disabled:hover:bg-[red] h-fit p-2 rounded-md text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex gap-1"
                                    ><Trash className="size-[20px]" /> </button>
                                  </div>

                                </div>
                                {
                                  cartVariantIndex < cartProduct.variants.length - 1 &&
                                  <div className="border border-myBorderColor" />
                                }
                              </React.Fragment>

                            )
                          })}
                        </div>
                      );
                    })}

                  </div>
                </div>
                <div>
                  <div className="w-full md:w-[250px] xl:w-[300px] h-fit rounded-[12px] bg-background_2 border border-myBorderColor py-4 px-5 flex flex-col gap-3 sticky top-[180px]">
                    <h2 className="
                      text-[105%]
                      font-semibold"
                    >
                      Order Summary
                    </h2>
                    <div className="w-full flex gap-3 justify-between">
                      <div className="text-[14px]">
                        Subtotal ({activeVariantsSize} items)
                      </div>
                      <div className="text-[14px]">
                        {subTotal}
                      </div>
                    </div>
                    <div className="w-full flex gap-3 justify-between">
                      <div className="text-[14px] flex-wrap flex max-w-[140px]">
                        Shipping Fee (est.)
                        <span>(can change)</span>
                      </div>
                      <div className="text-[14px]">
                        {shippingFee}
                      </div>
                    </div>
                    <div className="w-full flex gap-3 justify-between">
                      <div className="text-[14px] flex-wrap flex max-w-[140px]">
                        Total
                      </div>
                      <div className="text-[14px]">
                        {subTotal + shippingFee}
                      </div>
                    </div>
                    {activeVariantsSize > 0 ? (
                      <div className="uppercase h-max p-3 button2 text-sm rounded-[10px] cursor-pointer text-center hover:opacity-90">
                        <Link href="/checkout">
                          proceed to checkout
                        </Link>
                      </div>
                    ) : (
                      <span
                        className="uppercase h-max p-3 rounded-md text-center text-sm cursor-not-allowed opacity-50 button2 block"
                        aria-disabled="true"
                      >
                        proceed to checkout
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {showDeleteAllModal &&
                <YesNoModal
                  text1={"Are you sure, you want to delete your whole cart?"}
                  cancelFunction={() => {
                    setCurrentCartProductIndex(-99);
                    setCurrentCartVariantIndex(-99);
                    setShowDeleteAllModal(false);
                  }}
                  yesFunction={() => {
                    dispatch(deleteAllItems());
                    setCurrentCartProductIndex(-99);
                    setCurrentCartVariantIndex(-99);
                    setShowDeleteAllModal(false);
                  }}
                />
              }

              {showDeleteItemModal &&
                <YesNoModal
                  text1={"Are you sure, you want to delete this item?"}
                  cancelFunction={() => setShowDeleteItemModal(false)}
                  yesFunction={() => {
                    handleVariantDelete(currentCartProductIndex, currentCartVariantIndex);
                    setShowDeleteItemModal(false);
                  }}
                />
              }
            </>
            :
            <div className="w-full h-full">
              <div className="w-full h-[500px] flex-1 flex flex-col gap-3 items-center justify-between">
                <div className="flex-1 flex flex-col gap-3 items-center justify-center">
                  <div className="w-[30px] h-[30px] flex items-center justify-center bg-black rounded-full text-white text-sm">{cartItemsSize}</div>
                  <div className="text-sm ">
                    {
                      cartItemsSize ?
                        "Your have products in cart" :
                        "Your cart is empty"

                    }
                  </div>
                  {
                    !cartItemsSize ?

                      <Link href={"/collections/all-products"}
                        className="h-max p-3 bg-black text-sm text-white rounded-[10px] cursor-pointer"
                      >
                        All products
                      </Link>
                      :
                      <Link href={"/cart"}
                        className="h-max p-3 bg-black text-sm text-white rounded-[10px] cursor-pointer"
                      >
                        Show cart
                      </Link>
                  }
                </div>
              </div>
            </div>

        }
      </div>
    </div >
  );
}