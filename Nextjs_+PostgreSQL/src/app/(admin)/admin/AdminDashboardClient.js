"use client";
import React from "react";
import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useSessionExpiry } from "@/context/SessionExpiryContext";

export default function AdminDashboardClient({ recentOrders, lowStockProducts, totalProducts, totalOrders, revenueAgg }) {
  const { sessionData: session } = useSessionExpiry();
  const revenue = revenueAgg[0]?.total || 0;
  return (
    <div className="space-y-6 min-h-[1000px]">
      {/* Header */}
      <AdminTabContentHeader heading={"Dashboard"} description={`Welcome back, ${session?.user?.email}`} />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <DashboardCard title="Products" value={totalProducts} />
        <DashboardCard title="Orders" value={totalOrders} />
        <DashboardCard title="Customers" value="--" />
        <DashboardCard title="Revenue" value={`Rs. ${revenue.toFixed(2)}`} />
      </div>

      {/* Recent Orders */}
      <div className="bg-background_2 border border-myBorderColor rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Recent Orders (2 Days)</h2>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-myTextColorMain">
            No recent orders yet.
          </p>
        ) : (
          <div className="max-w-0 min-w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-myBorderColor text-left">
                  <th className="py-2">Order ID</th>
                  <th className="text-center bg-background_3">User</th>
                  <th className="text-center">Total</th>
                  <th className="text-center bg-background_3">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-myBorderColor">

                    <td className="py-3 pr-2 truncate max-w-[150px]">
                      {order._id}
                    </td>

                    <td className="py-3 px-2 text-center bg-background_3">
                      {order.userEmail || "Guest"}
                    </td>

                    <td className="py-3 px-2 text-center">
                      Rs. {order.pricing?.total}
                    </td>

                    <td className="py-3 px-2 text-center bg-background_3">
                      {order.status}
                    </td>

                    <td className="py-3 px-2 text-center">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="button2 p-2 rounded-full! flex w-max mx-auto"
                      >
                        <Eye className="size-4" />
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Low Stock */}
      <div className="bg-background_2 border border-myBorderColor rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Low Stock Products</h2>
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-myTextColorMain">
            All products currently have sufficient stock.
          </p>
        ) : (


          <div className="max-w-0 min-w-full overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-myBorderColor text-left">
                  <th className="pr-2 py-2">Product</th>
                  <th className="px-2 text-center bg-background_3 text-nowrap">Low Stock Variant</th>
                  <th className="px-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {lowStockProducts.flatMap((product) => {
                  const lowVariants = product.variants?.filter(v => v.stock < 10) || [];

                  return lowVariants.map((variant) => (
                    <tr key={`${product._id}-${variant.id}`} className="border-b border-myBorderColor">

                      <td className="py-3 pr-2 truncate max-w-[200px]">
                        {product.name}
                      </td>

                      <td className="py-3 px-2 text-center bg-background_3">
                        {variant.stock} left
                      </td>

                      <td className="py-3 px-2 text-center">
                        <Link
                          href={`/admin/products/${product._id}/edit?variant=${variant.id}`}
                          className="button2 p-2 !rounded-full flex w-max mx-auto"
                        >
                          <Eye className="size-4" />
                        </Link>
                      </td>

                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="bg-background_2 border border-myBorderColor rounded-lg p-4">
      <p className="text-sm text-myTextColorMain">{title}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}