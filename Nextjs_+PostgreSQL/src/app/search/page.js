"use client"
import Image from "next/image";
import SideBar from "@/components/sidebar";
import { MenuIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import Link from "next/link";
import Card3 from "@/components/Card3";
import { useRef, useState, useEffect } from "react";


export default function SearchWindow() {
  const {
    router,
    searchBarRef
  } = useAppContext();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!query) return;

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
        className="fixed inset-0 w-screen h-screen backdrop-blur-md bg-white/20 z-50"

      />
      <div


        className=
        {`
          z-[60]
          fixed
          w-screen
          h-screen

        `}
      >
        <div
          className=
          {`
            absolute
            z-1
            w-full
            h-full
            bg-[red]

          `}
        >

        </div>
        <div
          className=
          {`
            relative
            z-2
            max-w-[1024px]
            w-full
            h-full
            bg-[orange]
            mx-auto
            flex
            flex-col
            items-center
          `}
        >
          <div
            className=
            {`
                relative
                w-[93%]
                h-[60px]
                mt-12
                text-black
                text-[120%]
                outline-0
                rounded-[10px]
                bg-[gray]
                flex
                items-center
              `}
          >
            <div
              className=
              {`
                  ml-4
                  w-5
                  h-5
                  text-white
                `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m16 16-3.464-3.464m0 0a5 5 0 1 0-7.072-7.072 5 5 0 0 0 7.072 7.072v0Z"></path></svg>
            </div>
            <input
              className=
              {` 
                text-white
                text-[120%]
                outline-0
                mx-3
              `}
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value)}
            />
            {
              query.length > 0 &&
              <button
                className=
                {`
                  absolute
                  right-0
                  cursor-pointer
                  w-[20%]
                  h-[full]
                  text-white
                  text-[110%]
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
              h-full
              flex-1
              m-3
              rounded-[15px]
              grid
              grid-cols-3
              gap-x-2
              gap-y-2
              overflow-y-scroll
              
            `}
          >
            {
              products.map((product, index) =>
                <Card3 key={index} pthumbLink={product.pthumbLink} pname={product.pname} />
              )
            }
          </div>
        </div>
        {/* <div
          className=
          {`
            absolute
            z-[50]
            max-w-[1440px]
            w-full
            h-full
            flex
            bg-[red]
            mx-auto
          `}
        >
          <div
            className=
            {`
            w-[calc(100%-3rem)]

            relative
            mx-auto
            flex
            flex-col
            items-center
          `}
          >
            <div
              className=
              {`
                relative
                w-[60%]
                h-[60px]
                mt-12
                text-black
                text-[120%]
                outline-0
                rounded-[10px]
                bg-[gray]
                flex
                items-center
              `}
            >
              <div
                className=
                {`
                  ml-4
                  w-5
                  h-5
                  text-white
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m16 16-3.464-3.464m0 0a5 5 0 1 0-7.072-7.072 5 5 0 0 0 7.072 7.072v0Z"></path></svg>
              </div>
              <input
                className=
                {`
                  
                  text-white
                  text-[120%]
                  outline-0
                  mx-3
                `}
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
              />
              {
                query.length > 0 &&
                <button
                  className=
                  {`
                  absolute
                  right-0
                  cursor-pointer
                  w-[20%]
                  h-[full]
                  text-white
                  text-[110%]
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
                absolute
                top-[108px]
                w-[60%]
                h-[90%]
                m-3
                rounded-[25px]
                flex
                justify-center
                bg-[blue]
              `}
            >
              <div
                className=
                {`
                w-full
                h-[80%]
                grid
                grid-cols-3
                gap-x-2
                gap-y-2
                overflow-y-scroll
                
              `}
              >
                {
                  products.map((product, index) =>
                    <Card3 key={index} pthumbLink={product.pthumbLink} pname={product.pname} />
                  )
                }

              </div>
            </div>
          </div>
        </div> 
        <div
          className=
          {`
            z-[42]
            absolute
            w-screen
            h-screen

            bg-[green]
          `}
        > 

        </div>*/}
      </div>
    </>

  )
}
