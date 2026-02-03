"use client"
import { ArrowUpRight, ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Card1 from "@/components/Card1";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import { collections } from "@/app/api/data";
import { getVariantPricing } from "@/utils/productVariant";
import { useRef } from "react";
import SmallCardsList from "@/components/SmallCardsList";

export default function Collection() {
  const { collection_id } = useParams();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy"); // null | price_asc | price_desc | created_at

  const [products, setProducts] = useState([]);
  const LIMIT = 12;

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);


  const fetchProducts = async () => {
    if (
      !collection_id ||
      loading ||
      !hasMore ||
      fetchingRef.current
    ) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/collections/${collection_id}?offset=${offset}&limit=${LIMIT}`
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


  useEffect(() => {
    setProducts([]);
    setOffset(0);
    setHasMore(true);
  }, [collection_id]);

  useEffect(() => {
    fetchProducts();
  }, [collection_id]);


  function getDefaultVariant(product) {
    return (
      product.variants.find(v => v.default) ||
      product.variants[0]
    );
  }

  function getDefaultPrice(product) {
    return getDefaultVariant(product)?.price ?? 0;
  }

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

  const setSort = (value) => {
    if (!value) {
      router.push(`/collections/${collection_id}`);
    } else {
      router.push(
        `/collections/${collection_id}?sortBy=${value}`
      );
    }
  };

  useEffect(() => {
    if (products.length > 0)
      console.log(products[0].collection_name)
  }, [products])

  const collectionMeta = collections.find(
    c => c.id === collection_id
  );

  const title = collectionMeta?.name ?? "Products";


  return (
    <>
      <main
        className=
        {`
          z-1
          relative
          w-full
          bg-white
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
                <h1 className="text-[30px] font-bold text-black">{title}</h1>
              }
              <SmallCardsList productList={sortedProducts} className={""} />
              {

                hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={fetchProducts}
                      disabled={loading}
                      className={"px-6 py-2 rounded-md text-sm font-medium" + loading ? "" : "border"}
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