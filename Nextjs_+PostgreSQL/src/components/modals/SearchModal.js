"use client";
import Card3 from "@/components/Card3";
import { useState, useEffect } from "react";
import { useSearchModal } from "@/context/SearchModalContext";
import { Delete, Search, X } from "lucide-react";
import SmallCardsList from "../SmallCardsList";
import { useRouter } from "next/navigation";

export default function SearchModal() {

  const router = useRouter();
  const { isOpen, closeSearchModal, setSearchedProducts } = useSearchModal();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          // Save fetched results to context
          setSearchedProducts(query.trim().toLowerCase(), data);
        })
        .catch((err) => console.error("Error fetching products:", err));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

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
                
       
                w-[30px]
                h-[30px]
                button2
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
              h-[60px]
              text-foreground
              text-[120%]
              outline-1
              outline-myBorderColor
              rounded-[10px]
              bg-background_2
              flex
              px-3
              gap-3
              items-center
            `}
            >
              <Search className="min-w-[30px] min-h-[30px]  size-[30px] text-myTextColorMain/50" />
              <input
                className={` 
                  w-full
                  text-myTextColorMain
                  text-[20px]
                  outline-0
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
