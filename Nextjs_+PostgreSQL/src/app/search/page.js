"use client"
import Image from "next/image";
import SideBar from "@/components/sidebar";
import { MenuIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import Link from "next/link";
import Card3 from "@/components/Card3";
import { useRef, useState, useEffect } from "react";
import FloatingInput from "@/components/FloatingInput";


export default function SearchModal() {

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error("Error fetching products:", err));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <>
      <div
        className="fixed inset-0 w-screen h-screen z-100"
      >

        <div onClick={() => alert("clicked")} className="fixed size-full backdrop-blur-md bg-white/20 pointer-events-auto z-0">

        </div>
        <div
          className=
          {`
            relative
            z-1
            max-w-5xl
            w-full
            h-full
            border-l
            border-r
            border-[var(--myBorderColor)]
            bg-white
            mx-auto
            p-5
            pt-10
            flex
            flex-col
            items-center
            gap-3
          `}
        >
          <div
            className=
            {`
                relative
                w-full
                h-[60px]

                text-black
                text-[120%]
                outline-1
                outline-[var(--myBorderColor)]
                rounded-[10px]
                bg-[#fafafa]
                flex
                px-3
                gap-3
                items-center
              `}
          >
            <div
              className={`
                size-[30px]
                text-[gray]
              `}
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="m16 16-3.464-3.464m0 0a5 5 0 1 0-7.072-7.072 5 5 0 0 0 7.072 7.072v0Z"
                />
              </svg>
            </div>

            <input
              className=
              {` 
                text-[gray]
                text-[20px]
                outline-0
                flex-1
              `}
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {
              query.length > 0 &&
              <button
                onClick={() => setQuery("")}
                className=
                {`
                  cursor-pointer
                  w-[100px]
                  h-[full]
                  text-[gray]
                  text-[24px]
                  outline-0
                  rounded-[10px]
                  font-semibold
                `}
              >
                Cancel
              </button>
            }
          </div>
          <div
            className=
            {`
              bg-white
              w-full
              flex-1
              rounded-[16px]
              grid
              grid-cols-3
              gap-x-2
              gap-y-2
              custom-scrollbar
              overflow-y-scroll
              
            `}
          >
            {
              products.map((item, index) =>
                <Card3
                  key={index}
                  id={index}
                  productObj={item}
                />
              )
            }
          </div>
        </div>
      </div>
    </>

  )
}
