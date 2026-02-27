"use client"
import { ArrowUpRight, ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Card1 from "@/components/Card1";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import { getVariantPricing } from "@/utils/productVariant";
import { useRef } from "react";
import SmallCardsList from "@/components/SmallCardsList"
import { convertTextStringToDashString } from "@/utils/utilities";
import { useSearchModal } from "@/context/SearchModalContext";

export default function ProductListingClient({ data, visible_path_name, path_name, route, type }) {
  const { searchedProducts } = useSearchModal();
  const searchParams = useSearchParams();
  const query = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy"); // null | price_asc | price_desc | created_at

  const [products, setProducts] = useState([]);
  const LIMIT = 12;

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);


  const fetchProducts = async () => {
    if (
      !route ||
      loading ||
      !hasMore ||
      fetchingRef.current
    ) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/${path_name}/${route}?offset=${offset}&limit=${LIMIT}&type=${type}`
      );
      const json = await res.json();

      setProducts(prev => [...prev, ...json.data]);
      setHasMore(json.hasMore);
      setOffset(prev => prev + LIMIT);
    } catch (err) {
      console.error("Error fetching products:", err);
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
    setOffset(0);
    setHasMore(true);
  }, [route]);

  useEffect(() => {
    if (type === "search") {
      fetchSearchProducts();
    } else {
      fetchProducts();
    }
  }, [route, query, type]);

  const sortedProducts = React.useMemo(() => {
    if (!products.length) return [];

    const items = [...products];

    switch (sortBy) {
      case "price_asc":
        return items.sort(
          (a, b) =>
            getVariantPricing(a).price - getVariantPricing(b).price
        );

      case "price_desc":
        return items.sort(
          (a, b) =>
            getVariantPricing(b).price - getVariantPricing(a).price
        );

      case "created_at":
        return items.sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
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

  const dataMeta = React.useMemo(() => {
    return data.find((d) => convertTextStringToDashString(d?.name) === route) || null;
  }, [data]);

  const Title = () => {
    switch (type) {
      case "collection":
        return dataMeta?.name
      case "category":
        return "Category - " + dataMeta?.name
      case "search":
        return "Search Products"
      default:
        return "Products"
    }

  }


  return (
    <>
      <main
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
            <div
              className=
              {`
                w-full
                lg:w-[250px]
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
              {

                hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={fetchProducts}
                      disabled={loading}
                      className={`px-6 py-2 rounded-md text-sm font-medium ${loading ? "" : "border"}`}
                    >
                      {loading ? "Loading..." : "Load more"}
                    </button>
                  </div>
                )}

            </div>
          </div>

        </section>
      </main>
    </>
  );
}