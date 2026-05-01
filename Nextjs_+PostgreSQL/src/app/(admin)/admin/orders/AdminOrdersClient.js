"use client";

import { useEffect, useState } from "react";
import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useSessionExpiry } from "@/context/SessionExpiryContext";

export default function AdminOrdersClient() {
  const { sessionData: session } = useSessionExpiry();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchOrders();
  };

  return (
    <div className="space-y-6 min-h-[1000px]">
      <AdminTabContentHeader
        heading="Orders"
        description={`Welcome back, ${session?.user?.email}`}
      />
      <section className="bg-background_2 border border-myBorderColor rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-medium">All Orders</h2>

        {
          loading ?
            <div className=" flex items-center justify-center">
              <LoadingSpinner text="Loading" />
            </div>
            :
            <div className="max-w-0 min-w-full overflow-x-auto scrollbar-hide">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-myBorderColor text-left">
                    <th className="py-2">Order ID</th>
                    <th className="text-center bg-background_3">User</th>
                    <th className="text-center">Total</th>
                    <th className="text-center bg-background_3">Set status</th>
                    <th className="text-center ">Status</th>
                    <th className="text-center bg-background_3">Payment</th>
                    <th className="text-center px-2">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map(order => {

                    return (
                      <tr key={order._id} className="border-b border-myBorderColor">

                        <td className="min-w-3 max-w-40 truncate py-3 pr-2">
                          {order._id}
                        </td>

                        <td className="min-w-3 max-w-40 truncate py-3 px-2 text-center bg-background_3">
                          {order.userEmail || "Guest"}
                        </td>

                        <td className="py-3 px-2 text-center text-nowrap">
                          Rs. {order.pricing?.total}
                        </td>

                        <td className="py-3 px-2 text-center bg-background_3">
                          {order.status === "pending" &&
                            <div className="flex gap-4 flex-nowrap w-full items-center justify-center">
                              <button
                                disabled={loading}
                                onClick={() => updateStatus(order._id, "confirmed")}
                                className={`p-1 bg-background_2 border border-myBorderColor text-sm cursor-pointer`}
                              >
                                Confirm
                              </button>
                              <button
                                disabled={loading}
                                onClick={() => updateStatus(order._id, "cancelled")}
                                className={`p-1 bg-background_2 border border-myBorderColor text-sm cursor-pointer`}
                              >
                                Cancel
                              </button>
                            </div>
                          }

                          {order.status === "confirmed" &&
                            <button
                              disabled={loading}
                              onClick={() => updateStatus(order._id, "processing")}
                              className={`p-1 bg-background_2 border border-myBorderColor text-sm cursor-pointer`}
                            >
                              Start packing order
                            </button>
                          }

                          {order.status === "processing" &&
                            <button
                              disabled={loading}
                              onClick={() => updateStatus(order._id, "packed")}
                              className={`p-1 bg-background_2 border border-myBorderColor text-sm cursor-pointer`}
                            >
                              Order packed
                            </button>
                          }

                          {order.status === "packed" &&
                            <button
                              disabled={loading}
                              onClick={() => updateStatus(order._id, "shipped")}
                              className={`p-1 bg-background_2 border border-myBorderColor text-sm cursor-pointer`}
                            >
                              Shipped
                            </button>
                          }

                          {order.status === "shipped" &&

                            <button
                              disabled={loading}
                              onClick={() => updateStatus(order._id, "delivered")}
                              className={`p-1 bg-background_2 border border-myBorderColor text-sm cursor-pointer`}
                            >
                              Delivered
                            </button>
                          }
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="bg-background_3 border border-myBorderColor text-sm">
                            {order.status}
                          </div>
                        </td>

                        <td className="py-3 px-2 text-center bg-background_3">
                          {order.payment?.method} ({order.payment?.status})
                        </td>

                        <td className="py-3 px-2 flex gap-3 items-center justify-center">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="button2 p-2 rounded-full! flex w-max!"
                          >
                            <Eye className="size-4" />
                          </Link>
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