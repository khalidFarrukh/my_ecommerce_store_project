"use client";

import { useEffect, useState } from "react";
import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";

export default function AdminOrdersClient({ session }) {
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
    <div className="space-y-6">
      <AdminTabContentHeader
        heading="Orders"
        description={`Welcome back, ${session?.user?.email}`}
      />

      <section className="bg-background_2 border border-myBorderColor rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-medium">All Orders</h2>

        {loading ? (
          <div className="absolute w-full h-full left-0 top-0 flex items-center justify-center">Loading</div>
        ) : (
          <div className="w-full text-sm">
            <div className="grid grid-cols-[220px_200px_120px_120px_120px_150px] border-b border-myBorderColor py-2 font-medium">
              <div>Order ID</div>
              <div>User</div>
              <div>Total</div>
              <div>Status</div>
              <div>Payment</div>
              <div>Actions</div>
            </div>

            {orders.map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-[220px_200px_120px_120px_120px_150px] items-center py-3 border-b border-myBorderColor"
              >
                <div className="truncate">{order._id}</div>

                <div className="truncate">
                  {order.userEmail || "Guest"}
                </div>

                <div>Rs. {order.pricing?.total}</div>

                <div>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    className="input text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="capitalize">
                  {order.payment?.method} ({order.payment?.status})
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/admin/orders/${order._id}`}
                    className="button2 px-3 py-1 text-xs"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}