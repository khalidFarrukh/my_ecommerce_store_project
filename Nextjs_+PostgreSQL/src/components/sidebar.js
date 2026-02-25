"use client"
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { closeSidebar } from "@/store/sidebarSlice";


export default function SideBar() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();
  return (
    <aside className="font-poppins">
      {
        isOpen &&
        <div onClick={() => dispatch(closeSidebar())} className="fixed w-full h-full bg-background_1/50 pointer-events-auto z-[51]">

        </div>
      }
      <div
        // ref={sideBarRef}
        className=
        {`
        z-[100]
        ${isOpen ? "left-0" : "left-[-400px]"}
        fixed
        transition-all
        duration-150
        ease-in-out
        w-[350px]
        h-full
        bg-background_1
        border-r
        border-myBorderColor
      `}
      >

        <button
          onClick={() => dispatch(closeSidebar())}
          className=
          {`
              group
              absolute
              w-[30px]
              h-[30px]
              button2
              !rounded-full
              top-[10px]
              right-[10px]
              cursor-pointer
              flex
              items-center
              justify-center
            `}
        >
          <ArrowLeft />
        </button>
      </div>
    </aside>
  );
}
