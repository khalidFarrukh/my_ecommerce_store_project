"use client";

import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";
import Link from "next/link";
import { ArchiveIcon, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminProductIssues } from "@/utils/utilities";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useSessionExpiry } from "@/context/SessionExpiryContext";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { useSession } from "next-auth/react";
import { useGlobalToast } from "@/context/GlobalToastContext";
import { StrictProductSchema } from "@/schemas/productSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value]);

  return debounced;
}

function getPriceRange(variants) {
  if (!variants.length) return "—";

  // derive final prices with their variants
  const pricedVariants = variants.map((variant) => {
    const price = Number(variant.price) || 0;
    const discount = Number(variant.discount) || 0;

    const finalPrice = Math.ceil(
      price - (price * discount) / 100
    );

    return {
      ...variant,
      finalPrice,
    };
  });

  // single variant
  if (pricedVariants.length === 1) {
    return `Rs. ${pricedVariants[0].finalPrice}`;
  }

  // min/max variants
  const minVariant = pricedVariants.reduce((min, current) =>
    current.finalPrice < min.finalPrice ? current : min
  );

  const maxVariant = pricedVariants.reduce((max, current) =>
    current.finalPrice > max.finalPrice ? current : max
  );

  // same price
  if (minVariant.finalPrice === maxVariant.finalPrice) {
    return `Rs. ${minVariant.finalPrice}`;
  }

  return `Rs. ${minVariant.finalPrice} – Rs. ${maxVariant.finalPrice}`;
}

function getTotalStock(variants) {
  return variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
}

export default function AdminProductsClient() {
  const router = useRouter();
  // const { sessionData: session } = useSessionExpiry();
  const { data: session } = useSession();
  const { setToast } = useGlobalToast();

  // const [draftProducts, setDraftProducts] = useState([]);
  // const [activeProducts, setActiveProducts] = useState([]);
  // const [archivedProducts, setArchivedProducts] = useState([]);

  // const [loadingDraft, setLoadingDraft] = useState(true);
  // const [loadingActive, setLoadingActive] = useState(true);
  // const [loadingArchived, setLoadingArchived] = useState(true);
  const [isCreating, setIsCreating] = useState(false);


  const [activeSearch, setActiveSearch] = useState("");

  const [draftPage, setDraftPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [archivedPage, setArchivedPage] = useState(1);

  const limit = 5;

  // const [draftTotalPages, setDraftTotalPages] = useState(1);
  // const [activeTotalPages, setActiveTotalPages] = useState(1);
  // const [archivedTotalPages, setArchivedTotalPages] = useState(1);

  // const fetchDraftProducts = async () => {
  //   try {
  //     setLoadingDraft(true);

  //     const res = await fetch(
  //       `/api/admin/products?status=draft&offset=${(draftPage - 1) * limit}&limit=${limit}`
  //     );


  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message);

  //     setDraftProducts(data.data);
  //     setDraftTotalPages(data.totalPages); // 👈 important
  //   } catch (err) {
  //     console.error(err);
  //     setTimeout(() => {
  //       setToast({
  //         id: Date.now(),
  //         message: err.message,
  //         type: "error"
  //       })
  //     }, 0);
  //   } finally {
  //     setLoadingDraft(false);
  //   }
  // };

  // const fetchActiveProducts = async () => {
  //   try {
  //     setLoadingActive(true);

  //     const res = await fetch(
  //       `/api/admin/products?status=active&search=${debouncedActiveSearch}&offset=${(activePage - 1) * limit}&limit=${limit}`
  //     );


  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message);

  //     setActiveProducts(data.data);
  //     setActiveTotalPages(data.totalPages); // 👈 important
  //   } catch (err) {
  //     console.error(err);
  //     setTimeout(() => {
  //       setToast({
  //         id: Date.now(),
  //         message: err.message,
  //         type: "error"
  //       })
  //     }, 0);
  //   } finally {
  //     setLoadingActive(false);
  //   }
  // };

  // const fetchArchivedProducts = async () => {
  //   try {
  //     setLoadingArchived(true);

  //     const res = await fetch(
  //       `/api/admin/products?status=archive&offset=${(archivedPage - 1) * limit}&limit=${limit}`
  //     );


  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message);

  //     setArchivedProducts(data.data);
  //     setArchivedTotalPages(data.totalPages);
  //   } catch (err) {
  //     console.error(err);
  //     setTimeout(() => {
  //       setToast({
  //         id: Date.now(),
  //         message: err.message,
  //         type: "error"
  //       })
  //     }, 0);
  //   } finally {
  //     setLoadingArchived(false);
  //   }
  // };

  const {
    data: draftData,
    isLoading: loadingDraft,
  } = useQuery({
    queryKey: ["admin-products", "draft", draftPage],
    queryFn: async () => {
      const res = await fetch(
        `/api/admin/products?status=draft&offset=${(draftPage - 1) * limit}&limit=${limit}`
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    },
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

  const debouncedActiveSearch = useDebounce(activeSearch);

  const {
    data: activeData,
    isLoading: loadingActive,
  } = useQuery({
    queryKey: ["admin-products", "active", activePage, debouncedActiveSearch],
    queryFn: async () => {
      const res = await fetch(
        `/api/admin/products?status=active&search=${debouncedActiveSearch}&offset=${(activePage - 1) * limit}&limit=${limit}`
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    },

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


  const {
    data: archiveData,
    isLoading: loadingArchived,
  } = useQuery({
    queryKey: ["admin-products", "archive", archivedPage],
    queryFn: async () => {
      const res = await fetch(
        `/api/admin/products?status=archive&offset=${(activePage - 1) * limit}&limit=${limit}`
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    },

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

  const draftProducts = draftData?.data || [];
  const activeProducts = activeData?.data || [];
  const archivedProducts = archiveData?.data || [];

  const draftTotalPages = draftData?.totalPages || 1;
  const activeTotalPages = activeData?.totalPages || 1;
  const archivedTotalPages = archiveData?.totalPages || 1;

  const queryClient = useQueryClient();

  const restoreMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "active" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err) => {
      setToast({
        id: Date.now(),
        message: err.message,
        type: "error",
      });
    },
  });


  // useEffect(() => {
  //   fetchDraftProducts();
  // }, [draftPage]);

  // useEffect(() => {
  //   fetchArchivedProducts();
  // }, [archivedPage]);

  // useEffect(() => {
  //   fetchActiveProducts();
  // }, [debouncedActiveSearch, activePage]);

  // useEffect(() => {
  //   setActivePage(1);
  // }, [debouncedActiveSearch])

  // useEffect(() => {
  //   console.log(
  //     draftProducts.map(p => ({
  //       name: p.name,
  //       createdAt: p.createdAt
  //     }))
  //   );
  // }, [draftProducts])

  return (
    <div className="space-y-12 min-h-[1000px]">

      <AdminTabContentHeader
        heading="Products"
        description={`Welcome back, ${session?.user?.email}`}
        right_content={
          <button
            disabled={isCreating}
            onClick={async () => {
              if (isCreating) return;

              try {
                setIsCreating(true);

                const res = await fetch("/api/admin/products/new", {
                  method: "POST",
                });


                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                router.push(`/admin/products/${data.id}/edit`);
              } catch (err) {
                console.error(err);
                setTimeout(() => {
                  setToast({
                    id: Date.now(),
                    message: err.message,
                    type: "error"
                  })
                }, 0);
              } finally {
                setIsCreating(false);
              }
            }}
            className="button1 w-40 h-10 cursor-pointer disabled:opacity-50 disabled:cursor-none"
          >
            {isCreating ? "Creating..." : "+ Add Product"}
          </button>
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
            <div className="h-fit w-full">
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

                    {draftProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-500">
                          No draft products
                        </td>
                      </tr>
                    ) :

                      draftProducts.map(product => {
                        const result = StrictProductSchema.safeParse(product);
                        let issues = [];
                        if (!result.success) {
                          issues = result.error.issues;
                        }
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
                                  {issues.length > 10 ? "10+" : `${issues.length} left`}
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
              <Pagination
                page={draftPage}
                totalPages={draftTotalPages}
                onPageChange={setDraftPage}
              />
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
            <div className="w-full h-fit">
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

                    {activeProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-500">
                          No active products
                        </td>
                      </tr>
                    ) :


                      activeProducts.map(product => {

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
              <Pagination
                page={activePage}
                totalPages={activeTotalPages}
                onPageChange={setActivePage}
              />
            </div>
        }

      </section>


      {/* ===================== Archived Products ===================== */}

      <section className="bg-background_2 border border-myBorderColor rounded-lg p-4 space-y-4">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Archived Products</h2>
        </div>

        {
          loadingArchived ?
            <div className="flex items-center justify-center">
              <LoadingSpinner text="Loading" />
            </div>
            :
            <div className="w-full">

              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-myBorderColor text-left">
                      <th className="py-2 pr-2">Product</th>
                      <th className="px-2 text-center bg-background_3">Category</th>
                      <th className="px-2 text-center">Variants</th>
                      <th className="px-2 text-center bg-background_3">Price</th>
                      <th className="px-2 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {archivedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-500">
                          No archived products
                        </td>
                      </tr>
                    ) : (
                      archivedProducts.map(product => {

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

                            <td className="py-3 px-2 bg-background_3 flex gap-3 items-center justify-center">

                              <Link
                                href={`/admin/products/${product._id}/edit`}
                                className="button2 p-2 rounded-full! flex w-max!"
                              >
                                <Edit2 className="size-4" />
                              </Link>

                              {/* Restore button */}
                              <button
                                className="button1 px-3 py-1"
                                onClick={() => restoreMutation.mutate(product._id)}
                                disabled={restoreMutation.isPending}
                              >
                                {restoreMutation.isPending ? "Restoring..." : "Restore"}
                              </button>

                            </td>

                          </tr>
                        );
                      })
                    )}

                  </tbody>
                </table>
              </div>

              <Pagination
                page={archivedPage}
                totalPages={archivedTotalPages}
                onPageChange={setArchivedPage}
              />

            </div>
        }
      </section>

    </div>
  );
}
