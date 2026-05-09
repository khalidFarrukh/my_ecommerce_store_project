"use client";

import { useEffect, useState } from "react";
import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useSessionExpiry } from "@/context/SessionExpiryContext";
import CancelOrderButton from "@/components/orders/CancelOrderButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGlobalToast } from "@/context/GlobalToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function AdminOrdersClient() {
  // const { sessionData: session } = useSessionExpiry();
  const { data: session } = useSession();
  // const [orders, setOrders] = useState([]);
  // const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [cancelingOrder, setCancelingOrder] = useState(false);
  const { setToast } = useGlobalToast();

  // const fetchOrders = async () => {
  //   try {
  //     const res = await fetch("/api/admin/orders");
  //     const data = await res.json();

  //     if (!res.ok) throw new Error(data.message);

  //     setOrders(data.data || []);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  // const updateStatus = async (orderId, status) => {
  //   await fetch(`/api/admin/orders/${orderId}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ status }),
  //   });

  //   fetchOrders();
  // };

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      return data.data || [];
    },
    onError: (err) => {
      setToast({
        id: Date.now(),
        message: err.message,
        type: "error",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    },

    onSuccess: () => {

      setToast({
        id: Date.now(),
        message: "Order status updated successfully",
        type: "info",
      });

      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },

    onError: (err) => {
      setToast({
        id: Date.now(),
        message: err.message,
        type: "error",
      });
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const res = await fetch("/api/orders/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    },

    onSuccess: () => {
      setToast({
        id: Date.now(),
        message: "Order cancelled successfully",
        type: "info",
      });

      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },

    onError: (err) => {
      setToast({
        id: Date.now(),
        message: err.message,
        type: "error",
      });
    },
  });

  return (
    <div className="space-y-6 min-h-[1000px]">
      <AdminTabContentHeader
        heading="Orders"
        description={`Welcome back, ${session?.user?.email}`}
      />
      <section className="bg-background_2 border border-myBorderColor rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-medium">All Orders</h2>

        {
          isLoading ?
            <div className=" flex items-center justify-center">
              <LoadingSpinner text="Loading" />
            </div>
            :
            <div className="w-full h-fit">
              <div className="max-w-0 min-w-full overflow-x-auto scrollbar-hide">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-myBorderColor text-left">
                      <th className="pr-2 py-2 text-nowrap">Order ID</th>
                      <th className="px-2 text-center bg-background_3">User</th>
                      <th className="px-2 text-center">Total</th>
                      <th className="px-2 text-center bg-background_3 text-nowrap">Set status</th>
                      <th className="px-2 text-center ">Status</th>
                      <th className="px-2 text-center bg-background_3">Payment</th>
                      <th className="px-2 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-6 text-gray-500">
                          No orders yet
                        </td>
                      </tr>
                    ) :

                      orders.map(order => {

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
                                    disabled={isLoading}
                                    onClick={() =>
                                      updateStatusMutation.mutate({
                                        orderId: order._id,
                                        status: "confirmed",
                                      })
                                    }
                                    className={`px-3 py-1 button1 text-sm rounded-md! cursor-pointer`}
                                  >
                                    Confirm
                                  </button>
                                  <CancelOrderButton
                                    cancelingOrder={cancelingOrder}
                                    handleCancel={() => cancelOrderMutation.mutate(order._id)}
                                  />
                                </div>
                              }

                              {order.status === "confirmed" &&
                                <button
                                  disabled={isLoading}
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      orderId: order._id,
                                      status: "processing",
                                    })
                                  }
                                  className={`px-3 py-1 button1 text-sm rounded-md! cursor-pointer`}
                                >
                                  Start packing order
                                </button>
                              }

                              {order.status === "processing" &&
                                <button
                                  disabled={isLoading}
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      orderId: order._id,
                                      status: "packed",
                                    })
                                  }
                                  className={`px-3 py-1 button1 text-sm rounded-md! cursor-pointer`}
                                >
                                  Order packed
                                </button>
                              }

                              {order.status === "packed" &&
                                <button
                                  disabled={isLoading}
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      orderId: order._id,
                                      status: "shipped",
                                    })
                                  }
                                  className={`px-3 py-1 button1 text-sm rounded-md! cursor-pointer`}
                                >
                                  Shipped
                                </button>
                              }

                              {order.status === "shipped" &&

                                <button
                                  disabled={isLoading}
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      orderId: order._id,
                                      status: "delivered",
                                    })
                                  }
                                  className={`px-3 py-1 button1 text-sm rounded-md! cursor-pointer`}
                                >
                                  Delivered
                                </button>
                              }
                            </td>
                            <td className="py-3 px-2 text-center">
                              <div className="bg-background_3 border border-myBorderColor text-sm px-3 py-1 rounded-md">
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
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
        }
      </section>
    </div>
  );
}