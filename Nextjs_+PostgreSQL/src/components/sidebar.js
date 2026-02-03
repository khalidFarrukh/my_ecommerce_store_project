"use client"
import { ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { openSidebar, closeSidebar } from "@/store/sidebarSlice";


export default function SideBar() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();
  // const sidebarRef = useRef(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  // useEffect(() => {
  //   const observer = new ResizeObserver(([entry]) => {
  //     const width = entry.contentRect.width;
  //     if (width == 0) {

  //     }
  //   });

  //   if (sidebarRef.current) {
  //     observer.observe(sidebarRef.current);
  //   }

  //   return () => {
  //     if (sidebarRef.current) {
  //       observer.unobserve(sidebarRef.current);
  //     }
  //   };
  // }, []);
  return (
    <aside>
      {
        isOpen &&
        <div onClick={() => dispatch(closeSidebar())} className="fixed w-full h-full bg-white/50 pointer-events-auto z-[51]">

        </div>
      }
      <div
        // ref={sideBarRef}
        className=
        {`
        z-[100]
        ${isOpen ? "left-[0px]" : "left-[-400px]"}
        fixed
        transition-all
        duration-150
        ease-in-out
        w-[350px]
        h-full
        bg-[#fafafa]
        border-1
        border-[var(--myBorderColor)]
      `}
      >
        {
          isOpen ?

            <button
              onClick={() => dispatch(closeSidebar())}
              className=
              {`
                group
              absolute
              w-[30px]
              h-[30px]
              bg-black
              hover:bg-white
              border
              hover:border-black
              rounded-full
              top-[10px]
              right-[10px]
              cursor-pointer
              flex
              items-center
              justify-center
            `}
            >
              <ArrowLeft
                className=
                {`
            text-white
            group-hover:text-black
            `}
              />
            </button>
            :
            ""
        }
      </div>
    </aside>
  );
}
