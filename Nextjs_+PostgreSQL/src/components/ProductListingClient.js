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

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];

    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    for (let i = page - 1; i <= page + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex justify-center mt-10 gap-2 flex-wrap items-center">

      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 button1 border border-myBorderColor rounded-md! cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      {/* Pages */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 button1 border border-myBorderColor rounded-md! cursor-pointer ${p === page ? "bg-foreground! text-background_1!" : ""
              }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 button1 border border-myBorderColor rounded-md! cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default function ProductListingClient({ visible_path_name, path_name, route, type }) {
  const { searchedProducts } = useSearchModal();
  const searchParams = useSearchParams();
  const query = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy"); // null | price_asc | price_desc | created_at

  const [products, setProducts] = useState([]);
  const LIMIT = 12;

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);

  const minParam = Number(searchParams.get("minPrice")) || 0;
  const maxParam = Number(searchParams.get("maxPrice")) || 0;

  const [actualMaxPrice, setActualMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(minParam || 0);
  const [maxPrice, setMaxPrice] = useState(maxParam || 0);




  const fetchProducts = async (pageToFetch = 1) => {
    if (!route || loading || fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: pageToFetch,
        limit: LIMIT,
        type,
      });

      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const res = await fetch(
        `/api/${path_name}/${route}?${params.toString()}`
      );

      const json = await res.json();
      console.log(json)
      setProducts(json.data);
      setTotalPages(json.totalPages);
      setActualMaxPrice(Math.ceil(json.priceRange.maxPrice));
      setPage(pageToFetch);
    } catch (err) {
      console.error(err);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  };

  const fetchSearchProducts = async () => {
    if (!query) return;

    const normalizedQuery = query.trim().toLowerCase();

    // 1️⃣ Check context cache first
    if (searchedProducts[normalizedQuery]?.length > 0) {
      setProducts(searchedProducts[normalizedQuery]);
      setHasMore(false); // no pagination for now
      return;
    }

    // 2️⃣ Otherwise, fetch from API
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      setProducts(json);
      setHasMore(false); // search usually doesn't paginate
      // Optional: store in context if you want
      // setSearchedProducts(normalizedQuery, json);
    } catch (err) {
      console.error("Error fetching search products:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setProducts([]);
    setPage(1);
  }, [route]);

  useEffect(() => {
    setMinPrice(minParam);
  }, [minParam]);

  useEffect(() => {
    if (maxParam > 0) {
      // if URL has maxPrice → use it
      setMaxPrice(maxParam);
    } else if (actualMaxPrice > 0) {
      // fallback to API max
      setMaxPrice(actualMaxPrice);
    }
  }, [maxParam, actualMaxPrice]);

  useEffect(() => {
    if (type === "search") {
      fetchSearchProducts();
    } else {
      fetchProducts(page);
    }
  }, [route, query, type, page, minParam, maxParam]);

  const setPageAndURL = (p) => {
    setPage(p);

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

  // const setSort = (value) => {
  //   if (!value) {
  //     router.push(`/${visible_path_name}/${route}`);
  //   } else {
  //     router.push(
  //       `/${visible_path_name}/${route}?sortBy=${value}`
  //     );
  //   }
  // };

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

  if (loading && products.length === 0) {
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
          `}
        >
          <div
            className=
            {`
              flex
              gap-5
              w-full
              flex-col
              lg:flex-row
              mt-5
              mx-auto
            `}
          >
            <div className="w-full lg:w-[250px] flex flex-col gap-6">
              <div
                className=
                {`
                  w-full
                  h-fit
                  text-[14px]
                `}
              >
                Sort by
                <div className="flex flex-col gap-y-2 mt-3">
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
                    <span>{minPrice}</span>
                    <span>{maxPrice}</span>
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
            <div
              className=
              {`
                flex-1
              `}
            >
              {
                products.length > 0 &&
                <h1 className="text-[30px] font-bold"><Title /></h1>
              }
              <SmallCardsList
                productList={sortedProducts}
                className={`
                grid
                grid-cols-2
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

            </div>
          </div>

        </section>
      </div>
    </>
  );
}