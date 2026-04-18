"use client";

import { useState } from "react";

export default function AdminOrderActions({ orderStatus, orderId }) {
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = async (status) => {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        alert("Failed to update");
        return;
      }

      // reload page (simple)
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Error updating order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3 pt-4">
      <button
        disabled={loading}
        onClick={() => updateOrderStatus("processing")}
        className={`button2 px-4 py-2 cursor-pointer ${orderStatus === "processing" ? "bg-foreground! text-background_1!" : ""}`}
      >
        Processing
      </button>

      <button
        disabled={loading}
        onClick={() => updateOrderStatus("shipped")}
        className={`button2 px-4 py-2 cursor-pointer ${orderStatus === "shipped" ? "bg-foreground! text-background_1!" : ""}`}
      >
        Shipped
      </button>

      <button
        disabled={loading}
        onClick={() => updateOrderStatus("delivered")}
        className={`button2 px-4 py-2 cursor-pointer ${orderStatus === "delivered" ? "bg-foreground! text-background_1!" : ""}`}
      >
        Delivered
      </button>
    </div>
  );
}