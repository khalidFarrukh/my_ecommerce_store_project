"use client";

import CancelOrderButton from "@/components/orders/CancelOrderButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalToast } from "@/context/GlobalToastContext";

export default function OrderClient({ order }) {
  const router = useRouter();
  const [cancelingOrder, setCancelingOrder] = useState(false);
  const { setToast } = useGlobalToast();

  return (
    <section className="w-full max-w-4xl mx-auto py-6 space-y-6">

      {/* HEADER */}
      <div className="flex gap-3 flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="order-2 md:order-1 text-sm md:text-2xl font-medium md:font-bold">
          Order #{order._id}
        </h1>

        {order.status === "pending" &&
          <div className="order-1 md:order-2 w-full md:w-fit flex justify-end gap-3">
            <CancelOrderButton
              cancelingOrder={cancelingOrder}
              handleCancel={
                async () => {
                  try {
                    setCancelingOrder(true);
                    const orderId = order._id;
                    const res = await fetch("/api/orders/cancel", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ orderId }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                      throw new Error(data);
                    }

                    setTimeout(() => {
                      setToast({
                        id: Date.now(),
                        message: "Order cancelled successfully",
                        type: "info"
                      });
                    }, 0)

                    router.refresh(); // 🔥 re-fetch server data
                  } catch (err) {
                    setTimeout(() => {
                      setToast({
                        id: Date.now(),
                        message: err.message || "Failed to cancel order",
                        type: "error"
                      });
                    }, 0)
                  } finally {
                    setCancelingOrder(false);
                  }
                }
              } />
          </div>
        }

      </div>

      {/* ORDER INFO */}
      <div className="border border-myBorderColor rounded-md p-4 bg-background_2 space-y-2">
        <p className="text-sm">
          <span className="text-myTextColorMain">Placed on:</span>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>

        <p className="text-sm">
          <span className="text-myTextColorMain">Order status:</span>{" "}
          {order.status}
        </p>

        <p className="text-sm">
          <span className="text-myTextColorMain">Payment:</span>{" "}
          {order.payment.method.toUpperCase()} ({order.payment.status})
        </p>
      </div>

      {/* ITEMS */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Items</h2>

        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 border border-myBorderColor rounded-md p-3 bg-background_2"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded"
            />

            {/* INFO */}
            <div className="flex-1 space-y-1">
              <p className="font-medium">{item.productName}</p>

              <p className="text-sm text-myTextColorMain">
                Qty: {item.quantity}
              </p>

              <p className="text-sm">
                Rs. {item.finalPrice} × {item.quantity}
              </p>
            </div>

            {/* TOTAL */}
            <div className="font-semibold">
              Rs. {item.total}
            </div>
          </div>
        ))}
      </div>

      {/* SHIPPING ADDRESS */}
      <div className="border border-myBorderColor rounded-md p-4 bg-background_2 space-y-1">
        <h2 className="font-semibold mb-2">Shipping Address</h2>

        <p>{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.phone}</p>
        <p>{order.shippingAddress.city}</p>
        <p>{order.shippingAddress.addressLine}</p>
      </div>

      {/* PRICING */}
      <div className="border border-myBorderColor rounded-md p-4 bg-background_2 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs. {order.pricing.subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Rs. {order.pricing.shippingFee}</span>
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>Rs. {order.pricing.total}</span>
        </div>
      </div>
    </section>
  );
}