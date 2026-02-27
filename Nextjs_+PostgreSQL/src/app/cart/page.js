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


export default function Cart() {
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [currentCartProductIndex, setCurrentCartProductIndex] = useState(-99);
  const [currentCartVariantIndex, setCurrentCartVariantIndex] = useState(-99);

  const dispatch = useDispatch();
  const cartState = useSelector(state => state.cart.cartState);

  const cartItemsSize = React.useMemo(() => {
    let variantCount = 0;
    cartState.items.forEach(product => {
      variantCount += product.variants.length;
    });
    return variantCount;
  }, [cartState]);

  const [productsData, setProductsData] = useState([]);

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
      setProductsData(data);
    };

    fetchProducts();
  }, []);


  const enrichedCart = React.useMemo(() => {
    if (!productsData.length) return [];

    const result = cartState.items.map(cartProduct => {
      const fullProduct = productsData.find(
        p => p._id === cartProduct.product_id
      );

      if (!fullProduct) return null;

      return {
        ...fullProduct
      };
    }).filter(Boolean);
    return result;
  }, [cartState, productsData]);

  const [activeVariantsSize, subTotal, shippingFee] = React.useMemo(() => {
    let count = 0;
    let subTotalCount = 0;
    let totalChargeableWeight = 0;

    if (!enrichedCart.length) return [0, 0, 0];

    cartState.items.forEach((product, pIndex) => {
      product.variants.forEach((variant, vIndex) => {
        if (variant.active) {
          const enrichedProduct = enrichedCart.find(
            ep => ep._id === product.product_id
          );

          const enrichedVariant = enrichedProduct.variants.find(
            v => v.id === variant.variant_id
          );

          const price = enrichedVariant.price;
          const discount = enrichedVariant.discount ?? 0;
          const finalPrice = price - Math.round((price * discount) / 100);

          subTotalCount += finalPrice * variant.quantity;
          count++;

          const weight = Number(enrichedProduct.info.weight) || 0;
          let volumetricWeight = 0;
          if (enrichedProduct.info.dimensions?.includes("x")) {
            const [l, w, h] = enrichedProduct.info.dimensions
              .split("x")
              .map(n => Number(n) || 0);
            volumetricWeight = (l * w * h) / 5000;
          }
          const chargeableWeight = Math.max(weight, volumetricWeight);
          totalChargeableWeight += chargeableWeight * variant.quantity;
        }
      });
    });

    const shippingFee = getShippingPrice(totalChargeableWeight);
    return [count, subTotalCount, shippingFee];
  }, [cartState.items, enrichedCart]);


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


  return (

    <main
      className=
      {`
          relative
          w-full
          bg-background_1
          my-3
          flex
          flex-col
          items-center
        `}
    >
      <section
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
              <h1 className="text-[30px] font-bold ">Cart</h1>
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

                    {enrichedCart.map((product, product_index) => {

                      const cartProductIndex = cartState.items.findIndex(p => p.product_id === product._id)
                      const cartProduct = cartState.items[cartProductIndex];
                      return (

                        <div key={product._id} className="rounded-[12px] bg-background_2 border border-myBorderColor py-4 px-5 flex flex-col gap-6 lg:gap-3">
                          {/* <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                          <input className="size-[20px] cursor-pointer accent-black" type="checkbox" checked={cartProduct.active} onChange={() => handleProductCheckBox(cartProductIndex)} />
                          <h2 className="font-bold text-lg">
                            {product.name}
                          </h2>
                        </div>
                        <button onClick={() => {
                          if (cartState.items[cartProductIndex].active)
                            handleProductDelete(cartProductIndex)
                        }}
                          className=" cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        ><Trash className="size-[20px] text-[darkred] hover:text-[red]" /></button>
                      </div> */}


                          {cartProduct.variants.map((cartVariant, cartVariantIndex) => {

                            const fullVariantIndex = product.variants.findIndex(
                              v => v.id === cartVariant.variant_id
                            );

                            const fullVariant = product.variants[fullVariantIndex];

                            const price = fullVariant?.price
                            const discount = fullVariant?.discount ?? 0
                            const finalPrice = fullVariant
                              ? price - Math.round((price * discount) / 100)
                              : null

                            return (
                              <React.Fragment key={cartVariant.variant_id}>
                                <div
                                  className="flex md:items-center gap-2 lg:gap-4 justify-between"
                                >
                                  <input className="min-w-[20px] min-h-[20px] size-[20px] cursor-pointer accent-foreground" type="checkbox" checked={cartState.items[cartProductIndex].variants[cartVariantIndex].active} onChange={() => handleVariantCheckBox(cartProductIndex, cartVariantIndex)} />
                                  <div className="flex flex-row items-center justify-center gap-4 flex-wrap ">

                                    <Image
                                      src={fullVariant.images[0]["src"]}
                                      alt={product.name}
                                      className="mx-auto w-[100px]"
                                      width={1200}
                                      height={1200}
                                      priority
                                    />

                                    {/* <div className="flex w-max h-fit lg:hidden">
                                      <button
                                        onClick={() => {
                                          setCurrentCartProductIndex(cartProductIndex);
                                          setCurrentCartVariantIndex(cartVariantIndex);
                                          setShowDeleteItemModal(true);
                                        }}
                                        className="bg-[darkred] not-disabled:hover:bg-[red] h-fit p-2 rounded-[12px] text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex gap-1"
                                      ><Trash className="size-[20px]" /> </button>
                                    </div> */}

                                    <div className="flex justify-center items-center flex-row flex-wrap gap-4">

                                      <div className="w-[200px] flex flex-col">
                                        <h2 className="font-bold text-lg truncate">
                                          {product.name}
                                        </h2>
                                        {Object.entries(fullVariant.options).map(([k, v]) => (
                                          <div key={k} className=" truncate">{k}: {v}</div>
                                        ))}
                                      </div>

                                      <div className="flex flex-wrap items-center gap-4 justify-center">

                                        <div className="flex gap-2 items-center">
                                          {discount > 0 && (

                                            <div className="line-through">
                                              {price}
                                            </div>
                                          )}
                                          <div className=" font-bold text-2xl ">{finalPrice}</div>

                                        </div>

                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center overflow-hidden">
                                            <button
                                              onClick={() => decreaseQty(cartProductIndex, cartVariantIndex)}
                                              disabled={cartVariant.quantity === 1}
                                              className="px-3 py-1 inc_dec cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              -
                                            </button>

                                            <div className="w-8 text-center">
                                              {cartVariant.quantity}
                                            </div>

                                            <button
                                              onClick={() => increaseQty(cartProductIndex, cartVariantIndex)}
                                              disabled={cartVariant.quantity === 3}
                                              className="px-3 py-1 inc_dec cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              +
                                            </button>
                                          </div>
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
                  <div className="w-full md:w-[250px] xl:w-[300px] h-fit rounded-[12px] bg-background_2 border border-myBorderColor py-4 px-5 flex flex-col gap-3 sticky top-[165px]">
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
                      <Link href={"/checkout"} className="uppercase h-max p-3 button2 text-sm rounded-[10px] cursor-pointer text-center hover:opacity-90">
                        proceed to checkout
                      </Link>
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
              {showDeleteAllModal && (
                <div className="fixed inset-0 top-0 left-0 z-100 size-full flex items-center justify-center backdrop-blur-md bg-background_2/20">
                  <div className="bg-background_1 rounded-[12px] p-6 w-[90%] max-w-[400px] flex flex-col gap-5 outline outline-myBorderColor">

                    <h2 className="text-lg font-semibold text-center">
                      Are you sure, you want to delete your whole cart?
                    </h2>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setCurrentCartProductIndex(-99);
                          setCurrentCartVariantIndex(-99);
                          setShowDeleteAllModal(false);
                        }}
                        className="px-4 py-2 border rounded-md cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => {
                          dispatch(deleteAllItems());
                          setCurrentCartProductIndex(-99);
                          setCurrentCartVariantIndex(-99);
                          setShowDeleteAllModal(false);
                        }}
                        className="px-4 py-2 bg-[darkred] text-white rounded-md cursor-pointer hover:bg-red-600"
                      >
                        Yes
                      </button>
                    </div>

                  </div>
                </div>
              )}
              {showDeleteItemModal &&
                (
                  <div className="fixed inset-0 top-0 left-0 z-100 size-full flex items-center justify-center">
                    <div
                      onClick={() => setShowDeleteItemModal(false)}
                      className="fixed size-full backdrop-blur-md bg-background_2/20 pointer-events-auto z-0 cursor-pointer"
                      aria-hidden
                    />
                    <div className="z-1 bg-background_1 rounded-[12px] p-6 w-[90%] max-w-[400px] flex flex-col gap-5 ">

                      <h2 className="text-lg font-semibold text-center">
                        Are you sure, you want to delete this item?
                      </h2>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setShowDeleteItemModal(false)}
                          className="px-4 py-2 button rounded-md cursor-pointer"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={() => {
                            handleVariantDelete(currentCartProductIndex, currentCartVariantIndex);
                            setShowDeleteItemModal(false);
                          }}
                          className="px-4 py-2 bg-[darkred] text-white rounded-md cursor-pointer hover:bg-red-600"
                        >
                          Yes
                        </button>
                      </div>

                    </div>
                  </div>
                )
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
      </section>
    </main >
  );
}