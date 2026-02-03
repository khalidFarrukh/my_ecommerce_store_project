"use client"
import Image from "next/image";
import SideBar from "@/components/sidebar";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";

export default function CustomCartBox() {
  const {
    smallCartBoxRef,
    isCartBtnHovered,
    setIsCartBtnHovered
  } = useAppContext();
  return (
    <>
      <div
        ref={smallCartBoxRef}
        onMouseEnter={() => setIsCartBtnHovered(true)}
        onMouseLeave={() => setIsCartBtnHovered(false)}
        className=
        {`  
          z-[100]
          absolute
          w-[400px]
          h-[300px]
          bg-white
          border
          border-gray-200
          right-[0px]
          p-5
          transition-all duration-250 ease-in-out
          flex flex-col gap-3
          ${isCartBtnHovered ? "opacity-100 top-[59px] pointer-events-auto" : "opacity-0 top-[70px] pointer-events-none"}    
        `}
      >
        <h1 className="h-max flex items-center justify-center">Cart</h1>
        <div className="flex-1 flex flex-col gap-3 items-center justify-between">
          <div className="flex-1 flex flex-col gap-3 items-center justify-center">
            <div className="w-[30px] h-[30px] flex items-center justify-center bg-black rounded-full text-white text-sm">{0}</div>
            <div className="text-sm ">Your Shopping Bag is Empty</div>
          </div>
          <Link href={"/collections/all-products"}
            className="h-max p-3 bg-black text-sm text-white rounded-[10px] cursor-pointer"
          >
            Explore products
          </Link>
        </div>
      </div>
    </>
  )
}
