"use client";
import Card3 from "@/components/Card3";
import { useState, useEffect } from "react";
import { useSearchModal } from "@/context/SearchModalContext";
import { Delete, Search, X } from "lucide-react";
import SmallCardsList from "../SmallCardsList";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function SearchModal() {

  const router = useRouter();
  const { isOpen, closeSearchModal } = useSearchModal();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(t);
  }, [query]);


  const { data: products = [] } = useQuery({
    queryKey: ["search", debouncedQuery],

    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      const json = await res.json();

      if (!res.ok) throw new Error("Search failed");

      return json.data;
    },

    enabled: !!debouncedQuery,
    onError: (err) => {
      setTimeout(() => {
        setToast({
          id: Date.now(),
          message: err.message,
          type: "error",
        });
      }, 0);
    },
    staleTime: 1000 * 30,
  });

  const goToSearchPage = () => {
    if (query.trim()) {
      closeSearchModal();
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      {
        isOpen &&
        <div
          className="fixed inset-0 size-full z-100"
        >
          <div
            onClick={closeSearchModal}
            className="fixed size-full backdrop-blur-md bg-background_2/20 pointer-events-auto z-0 cursor-pointer"
            aria-hidden
          />
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
            border-myBorderColor
            bg-background_1
            mx-auto
            p-5
            flex
            flex-col
            
            gap-3
          `}
          >
            <div className="w-full flex justify-end mb-3">
              <button
                onClick={closeSearchModal}
                className=
                {`
                
       
                w-7.5
                h-7.5
                button1
                rounded-full!
                cursor-pointer
                flex
                items-center
                justify-center
              `}
              >
                <X />
              </button>
            </div>
            <div
              className=
              {`
              relative
              w-full
              
              text-foreground
              text-[120%]
              outline-1
              outline-myBorderColor
              rounded-[10px]
              bg-background_2
              flex
              gap-3
              items-center
            `}
            >
              <div className="absolute min-w-15 w-15 h-fit flex justify-center">

                <Search className="min-w-[30px] min-h-[30px]  size-[30px] text-myTextColorMain/50" />
              </div>
              <input
                className={` 
                  w-full
                  min-h-14
                  h-14
                  pl-15
                  pr-4
                  text-xl
                  border
                  border-myBorderColor
                  rounded-md
                  outline-none
                  `}
                type="search"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    goToSearchPage();
                  }
                }}
              />
            </div>
            {
              products.length > 0 &&
              <SmallCardsList
                productList={products}
                className={`
                grid
                grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                mt-5
                gap-x-5
                gap-y-5
                w-full
                custom-scrollbar
                overflow-y-scroll
                `}
                card1_className={"!min-h-[300px] !h-[15vw] !lg:h-[15vw]"}
              />
            }
          </div>
        </div>
      }
    </>

  )
}
