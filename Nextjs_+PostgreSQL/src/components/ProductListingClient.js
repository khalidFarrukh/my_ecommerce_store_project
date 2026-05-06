"use client"
import { ArrowUpRight, ArrowRight } from "lucide-react";
import React, { useState, useEffect, act } from "react";
import Link from "next/link";
import Card1 from "@/components/Card1";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import { getDefaultVariantPricing } from "@/utils/productVariant";
import { useRef } from "react";
import SmallCardsList from "@/components/SmallCardsList"
import { convertDashStringToTextString, convertTextStringToDashString } from "@/utils/utilities";
import { useSearchModal } from "@/context/SearchModalContext";
import LoadingSpinner from "./ui/LoadingSpinner";
import { Pagination } from "./Pagination";
import NotFound from "./NotFound";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { useQuery } from "@tanstack/react-query";

export default function ProductListingClient({ visible_path_name, path_name, route, type }) {
  const { searchedProducts } = useSearchModal();
  const searchParams = useSearchParams();
  const { areCategoriesOpen } = useCategoriesContext();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // const [products, setProducts] = useState([]);
  // const [totalPages, setTotalPages] = useState(1);

  // const [loading, setLoading] = useState(true);
  // const fetchingRef = useRef(false);
  // const [actualMaxPrice, setActualMaxPrice] = useState(0);
  const LIMIT = 10;

  const page = Number(searchParams.get("page") || 1);
  const minParam = Number(searchParams.get("minPrice")) || 0;
  const maxParam = Number(searchParams.get("maxPrice")) || 0;
  const query = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy"); // null | price_asc | price_desc | created_at


  const isSearch = type === "search";

  const productsQuery = useQuery({
    queryKey: ["products", route, page, minParam, maxParam, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        type,
      });

      if (minParam) params.append("minPrice", minParam);
      if (maxParam) params.append("maxPrice", maxParam);

      const res = await fetch(
        `/api/${path_name}/${route}?${params.toString()}`
      );

      return res.json();
    },
    enabled: !isSearch, // 🔥 only run if NOT search
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const searchQuery = useQuery({
    queryKey: ["search", query, page, minParam, maxParam], // 🔥 include page
    queryFn: async () => {
      const params = new URLSearchParams({
        q: query,
        page,
        limit: LIMIT,
      });

      if (minParam) params.append("minPrice", minParam);
      if (maxParam) params.append("maxPrice", maxParam);

      const res = await fetch(`/api/search?${params.toString()}`);
      return res.json();
    },
    enabled: isSearch && !!query,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });


  const products = isSearch
    ? (searchQuery.data?.data || [])
    : (productsQuery.data?.data || []);

  const totalPages = isSearch
    ? (searchQuery.data?.totalPages || 1)
    : (productsQuery.data?.totalPages || 1);

  const actualMaxPrice = isSearch
    ? (searchQuery.data?.priceRange?.maxPrice || 0)
    : (productsQuery.data?.priceRange?.maxPrice || 0);

  const isLoading = isSearch
    ? searchQuery.isLoading
    : productsQuery.isLoading;


  const [minPrice, setMinPrice] = useState(minParam || 0);
  const [maxPrice, setMaxPrice] = useState(maxParam || actualMaxPrice);

  useEffect(() => {
    setMinPrice(minParam);
  }, [minParam]);

  useEffect(() => {
    setMaxPrice(maxParam || actualMaxPrice);
  }, [maxParam, actualMaxPrice]);

  const setPageAndURL = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const sortedProducts = React.useMemo(() => {
    if (!products.length) return [];

    const items = [...products];

    switch (sortBy) {
      case "price_asc":
        return items.sort(
          (a, b) =>
            getDefaultVariantPricing(a).finalPrice - getDefaultVariantPricing(b).finalPrice
        );

      case "price_desc":
        return items.sort(
          (a, b) =>
            getDefaultVariantPricing(b).finalPrice - getDefaultVariantPricing(a).finalPrice
        );

      case "created_at":
        return items.sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

      default:
        // default = already sorted by backend (latest arrival)
        return items;
    }
  }, [products, sortBy]);

  const router = useRouter();

  const setSort = (value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("sortBy", value);
    } else {
      params.delete("sortBy");
    }

    if (type === "search") {
      // Preserve search query
      router.push(`/${visible_path_name}?${params.toString()}`);
    } else {
      // Category / Collection route
      router.push(`/${visible_path_name}/${route}?${params.toString()}`);
    }
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    params.set("page", 1); // reset page

    if (type === "search") {
      router.push(`/${visible_path_name}?${params.toString()}`);
    } else {
      router.push(`/${visible_path_name}/${route}?${params.toString()}`);
    }
  };

  const clearPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.set("page", 1);

    if (type === "search") {
      router.push(`/${visible_path_name}?${params.toString()}`);
    } else {
      router.push(`/${visible_path_name}/${route}?${params.toString()}`);
    }
  };

  const Title = () => {
    switch (type) {
      case "collection":
        return convertDashStringToTextString(route);
      case "category":
        return "Category - " + convertDashStringToTextString(route)
      case "search":
        return "Search Products"
      default:
        return "Products"
    }

  }

  if (isLoading) {
    return <div className="min-h-[calc(100vh-60px-98px-176px)] md:min-h-[calc(100vh-60px-98px-140px)] flex items-center justify-center">
      <LoadingSpinner text="Loading" />
    </div>
  }

  return (
    <>
      <div
        className=
        {`

          relative
          w-full
          bg-background_1
          py-3
          flex
          flex-col
          items-center
        `}
      >
        <section
          className=
          {`
            w-full
          `}
        >
          <div
            className=
            {`
              flex
              gap-5
              lg:gap-10
              w-full
              ${areCategoriesOpen ? "min-h-[calc(100vh-60px-98px-176px-42px)] md:min-h-[calc(100vh-60px-98px-140px-42px)]" : "min-h-[calc(100vh-60px-48px-176px-42px)] md:min-h-[calc(100vh-60px-48px-140px-42px)]"}
              transition-all
              duration-200
              flex-col
              lg:flex-row
              mt-5
              mx-auto
            `}
          >
            <div className="relative w-full lg:w-[250px] transition-all duration-200 flex flex-col">
              <div className="z-48 w-full flex justify-end lg:hidden">
                <button
                  onClick={() => setIsFiltersOpen(prev => !prev)}
                  className="button1 px-2 py-1 cursor-pointer"

                >
                  Filters
                </button>
              </div>
              <div
                className={`
                  overflow-hidden
                  transition-all
                  duration-300
                  ${isFiltersOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
                  lg:max-h-none lg:opacity-100
                `}
              >
                <div className="w-full lg:sticky z-47 flex flex-col gap-6 bg-background_1">
                  <div
                    className=
                    {`
                  w-full
                  h-fit
                  text-[14px]
                `}
                  >
                    Sort by
                    <div className="w-fit flex flex-col gap-y-2 mt-3">
                      <button
                        onClick={() => setSort("created_at")}
                        className={`cursor-pointer w-max ${sortBy === "created_at" || !sortBy ? "font-bold" : ""}`}
                      >
                        Latest arrival
                      </button>

                      <button
                        onClick={() => setSort("price_asc")}
                        className={`cursor-pointer w-max ${sortBy === "price_asc" ? "font-bold" : ""}`}
                      >
                        Price: low to high
                      </button>

                      <button
                        onClick={() => setSort("price_desc")}
                        className={`cursor-pointer w-max ${sortBy === "price_desc" ? "font-bold" : ""}`}
                      >
                        Price: high to low
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-fit text-[14px]">
                    <h3 className="mb-2">Price Range</h3>

                    <div className="px-2">
                      {/* Range track */}
                      <div className="relative h-6 flex items-center">

                        {/* Min slider */}
                        <input
                          type="range"
                          min={0}
                          max={actualMaxPrice}
                          value={minPrice}
                          onChange={(e) => {
                            const val = Math.min(Number(e.target.value), maxPrice - 1);
                            setMinPrice(val);
                          }}
                          className="
                        z-1 absolute w-full pointer-events-none appearance-none bg-transparent
                        [&::-webkit-slider-thumb]:pointer-events-auto
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-foreground
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:-translate-x-1/2
                      "
                        />

                        {/* Max slider */}
                        <input
                          type="range"
                          min={0}
                          max={actualMaxPrice}
                          value={maxPrice}
                          onChange={(e) => {
                            const val = Math.max(Number(e.target.value), minPrice + 1);
                            setMaxPrice(val);
                          }}
                          // className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto"
                          className="
                        z-1 absolute w-full pointer-events-none appearance-none bg-transparent
                        [&::-webkit-slider-thumb]:pointer-events-auto
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-foreground
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:translate-x-1/2
                      "
                        />

                        {/* Track background */}
                        <div className="w-full h-1 bg-background_3 rounded" />

                        {/* Active range */}
                        <div
                          className="z-0 absolute h-1 bg-foreground rounded"
                          style={{
                            left: `calc(${(minPrice / actualMaxPrice) * 100}% - 8px)`,
                            right: `calc(${100 - (maxPrice / actualMaxPrice) * 100}% - 8px)`,
                          }}
                        />
                      </div>

                      {/* Values */}
                      <div className="flex justify-between mt-2 text-sm">
                        <span>Rs. {minPrice}</span>
                        <span>Rs. {maxPrice}</span>
                      </div>
                    </div>
                    <div className="w-full flex space-x-3">
                      {/* Actions */}
                      <button
                        onClick={applyPriceFilter}
                        className="mt-3 px-3 py-1 w-1/2 button1 border-foreground! cursor-pointer"
                      >
                        Apply
                      </button>

                      <button
                        onClick={clearPriceFilter}
                        className="mt-2 px-3 py-1 text-sm w-1/2 button1 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex-1"
            >
              {
                products.length > 0 ?
                  <>
                    <h1 className="text-[30px] font-bold"><Title /></h1>

                    <SmallCardsList
                      productList={sortedProducts}
                      className={`
                      grid

                      grid-cols-2
                      md:grid-cols-3
                      lg:grid-cols-4
                      mt-5
                      gap-x-5
                      gap-y-5
                      w-full
                      `}
                      card1_className={"!min-h-[300px] !h-[15vw] !lg:h-[15vw]"}
                    />
                    {totalPages > 1 && (
                      <div className="mt-8">
                        <Pagination
                          page={page}
                          totalPages={totalPages}
                          onPageChange={setPageAndURL}
                        />
                      </div>
                    )}
                  </>
                  :
                  <div className="min-h-[calc(100vh-60px-300px)] lg:min-h-[calc(100vh-300px)] flex items-center justify-center">
                    No product
                  </div>
              }

            </div>
          </div>

        </section >
      </div >
    </>
  );
}