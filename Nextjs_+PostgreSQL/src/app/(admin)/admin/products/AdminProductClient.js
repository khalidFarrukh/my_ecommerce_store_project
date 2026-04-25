"use client";

import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";
import Link from "next/link";
import { ArchiveIcon, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminProductIssues } from "@/utils/utilities";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value]);

  return debounced;
}



function getPriceRange(variants) {
  const prices = variants
    .map(v => Number(v.price))
    .filter(Boolean);

  if (!prices.length) return "—";

  if (prices.length === 1) return `$${prices[0]}`;

  return `$${Math.min(...prices)} – $${Math.max(...prices)}`;
}

function getTotalStock(variants) {
  return variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
}

export default function AdminProductsClient({ session }) {


  const [draftProducts, setDraftProducts] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [loadingActive, setLoadingActive] = useState(true);

  const [activeSearch, setActiveSearch] = useState("");

  const fetchDraftProducts = async () => {
    try {
      const res = await fetch(
        `/api/admin/products?status=draft&offset=0&limit=20`
      );
      const data = await res.json();
      setDraftProducts(data.data);
    }
    catch (err) {
      console.error(err);
    }
    finally {
      setLoadingDraft(false);
    }
  };

  const fetchActiveProducts = async () => {
    try {

      const res = await fetch(
        `/api/admin/products?status=active&search=${activeSearch}&offset=0&limit=20`
      );
      const data = await res.json();
      setActiveProducts(data.data);
    }
    catch (err) {
      console.error(err);
    }
    finally {
      setLoadingActive(false);
    }
  };

  const debouncedActiveSearch = useDebounce(activeSearch);

  useEffect(() => {
    fetchDraftProducts();
  }, []);

  useEffect(() => {
    fetchActiveProducts();
  }, [debouncedActiveSearch]);

  useEffect(() => {
    console.log(
      draftProducts.map(p => ({
        name: p.name,
        createdAt: p.createdAt
      }))
    );
  }, [draftProducts])

  return (
    <div className="space-y-6 min-h-[1000px]">

      <AdminTabContentHeader
        heading="Products"
        description={`Welcome back, ${session?.user?.email}`}
        right_content={
          <Link
            href="/admin/products/new"
            className="button1 px-4 py-2"
          >
            + Add Product
          </Link>
        }
      />

      {/* Top Toolbar */}
      {/* <div className="p-4 bg-background_2 border border-myBorderColor rounded-lg flex justify-end">

      </div> */}


      {/* ===================== Draft Products ===================== */}

      <section className="bg-background_2 border border-myBorderColor rounded-lg p-4 space-y-4">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Draft Products</h2>
        </div>

        {
          loadingDraft ?
            <div className=" flex items-center justify-center">
              <LoadingSpinner text="Loading" />
            </div>
            :
            <div className="max-w-0 min-w-full overflow-x-auto scrollbar-hide">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-myBorderColor text-left">
                    <th className="py-2 pr-2">Product</th>
                    <th className="px-2 text-center bg-background_3">Variants</th>
                    <th className="px-2 text-center">Price</th>
                    <th className="px-2 text-center bg-background_3">Stock</th>
                    <th className="px-2 text-center">Issues</th>
                    <th className="px-2 text-center bg-background_3">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {draftProducts.map(product => {
                    const issues = getAdminProductIssues(product);
                    const priceRange = getPriceRange(product.variants);
                    const stock = getTotalStock(product.variants);

                    return (
                      <tr key={product._id} className="border-b border-myBorderColor">

                        <td className="min-w-10 max-w-40 truncate py-3 pr-2">
                          {product.name || "Untitled Product"}
                        </td>

                        <td className="py-3 px-2 text-center bg-background_3">
                          {product.variants.length}
                        </td>

                        <td className="py-3 px-2 text-center text-nowrap">
                          {priceRange}
                        </td>

                        <td className="py-3 px-2 text-center bg-background_3">
                          {stock}
                        </td>

                        <td className="py-3 px-2 text-center text-nowrap">
                          {issues.length === 0 ? (
                            <span className="text-green-500">Ready</span>
                          ) : (
                            <span className="text-yellow-500">
                              {issues[0]}
                              {issues.length > 1 && ` (+${issues.length - 1})`}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-2 bg-background_3 flex gap-3 items-center justify-center">

                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="button2 p-2 rounded-full! flex w-max!"
                          >
                            <Edit2 className="size-4" />
                          </Link>

                          {issues.length === 0 && (
                            <button className="button1 px-3 py-1">
                              Activate
                            </button>
                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
        }

      </section>

      {/* ===================== Active Products ===================== */}

      <section className="bg-background_2 border border-myBorderColor rounded-lg p-4 space-y-4">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Active Products</h2>

          <input
            value={activeSearch}
            onChange={(e) => setActiveSearch(e.target.value)}
            placeholder="Search active..."
            className="input w-72 px-3 py-2 text-base
            bg-inputBgNormal
            border
            border-myBorderColor
            rounded-md
            outline-none
            focus:border-foreground
            focus:ring-2
            focus:ring-foreground/20
            "
          />
        </div>

        {
          loadingActive ?
            <div className=" flex items-center justify-center">
              <LoadingSpinner text="Loading" />
            </div>
            :

            <div className="max-w-0 min-w-full overflow-x-auto scrollbar-hide">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-myBorderColor text-left">
                    <th className="py-2 pr-2">Product</th>
                    <th className="px-2 text-center bg-background_3">Category</th>
                    <th className="px-2 text-center">Variants</th>
                    <th className="px-2 text-center bg-background_3">Price</th>
                    <th className="px-2 text-center">Stock</th>
                    <th className="px-2 text-center bg-background_3">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {activeProducts.map(product => {

                    const priceRange = getPriceRange(product.variants);
                    const stock = getTotalStock(product.variants);

                    return (
                      <tr key={product._id} className="border-b border-myBorderColor">

                        <td className="min-w-40 max-w-40 truncate py-3 px-2">
                          {product.name}
                        </td>

                        <td className="py-3 px-2 text-center bg-background_3">
                          {product.category || "—"}
                        </td>

                        <td className="py-3 px-2 text-center">
                          {product.variants.length}
                        </td>

                        <td className="py-3 px-2 text-center text-nowrap bg-background_3">
                          {priceRange}
                        </td>

                        <td className="py-3 px-2 text-center">
                          {stock}
                        </td>

                        <td className="py-3 px-2 bg-background_3 flex gap-3 items-center justify-center">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="button2 p-2 rounded-full! flex w-max!"
                          >
                            <Edit2 className="size-4" />
                          </Link>
                          {Number(stock) === 0 && (
                            <button className="button2 p-2 rounded-full! flex w-max!">
                              <ArchiveIcon className="size-4" />
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
        }


      </section>

    </div>
  );
}
