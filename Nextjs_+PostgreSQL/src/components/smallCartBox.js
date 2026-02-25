"use client"
import Image from "next/image";
import SideBar from "@/components/sidebar";
import { useCartButtonContext } from "@/context/CartButtonContext";
import Link from "next/link";
import { useSelector } from "react-redux";
import React from "react";

export default function CustomCartBox() {
  const { isCartBtnHovered, setIsCartBtnHovered } = useCartButtonContext();

  const cartState = useSelector(state => state.cart.cartState);

  const cartItemsSize = React.useMemo(() => {
    let variantCount = 0;
    cartState.items.forEach(product => {
      variantCount += product.variants.length;
    });
    return variantCount;
  }, [cartState]);
  return (
    <>
      <div
        onMouseEnter={() => setIsCartBtnHovered(true)}
        onMouseLeave={() => setIsCartBtnHovered(false)}
        className=
        {`
          hidden
          z-[100]
          absolute
          w-[400px]
          h-[300px]
          bg-background_1
          border
          border-myBorderColor
          right-[0px]
          p-5
          transition-all duration-250 ease-in-out
          lg:flex flex-col gap-3
          ${isCartBtnHovered ? "opacity-100 top-[59px] pointer-events-auto" : "opacity-0 top-[70px] pointer-events-none"}    
        `}
      >
        <h1 className="h-max flex items-center justify-center">Cart</h1>
        <div className="flex-1 flex flex-col gap-3 items-center justify-between">
          <div className="flex-1 flex flex-col gap-3 items-center justify-center">
            <div className="w-[30px] h-[30px] flex items-center justify-center bg-foreground rounded-full text-background_1 text-sm">{cartItemsSize}</div>
            <div className="text-sm ">
              {
                cartItemsSize ?
                  "Your have products in cart" :
                  "Your cart is empty"

              }
            </div>
          </div>
          {
            !cartItemsSize ?

              <Link href={"/collections/all-products"}
                className="h-max p-3 text-sm button cursor-pointer"
              >
                All products
              </Link>
              :
              <Link href={"/cart"}
                className="h-max p-3 text-sm button2 cursor-pointer"
              >
                Show cart
              </Link>
          }
        </div>
      </div>
    </>
  )
}
