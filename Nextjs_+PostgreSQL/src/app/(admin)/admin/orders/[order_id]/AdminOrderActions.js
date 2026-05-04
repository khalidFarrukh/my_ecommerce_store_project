"use client";

import { useState } from "react";
import { useGlobalToast } from "@/context/GlobalToastContext";

export default function AdminOrderActions({ orderStatus, orderId }) {
  const [loading, setLoading] = useState(false);
  const { setToast } = useGlobalToast();

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
        setToast({
          id: Date.now(),
          message: "Failed to update order status",
          type: "error"
        });
        return;
      }

      // reload page (simple)
      window.location.reload();

    } catch (err) {
      console.error(err);
      setToast({
        id: Date.now(),
        message: err.message || "Error updating order status",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  // below i have different order status buttons, and the active one is highlighted. admin can click to change order status. but i want to add 
  // another logic such that initially the orderStatus is pending, and if it is pending the admin should only be able to change it to processing, if it is processing then only be able to change to shipped and if it is shipped then only be able to change to delivered. so the order status should follow a flow and admin should not be able to skip any status. can you help me with that logic?
  // change the code below to implement the above logic. you can use { orderStatus === "status" && button } based on the current orderStatus.  
  return (
    <div className="flex gap-3 pt-4">
      {orderStatus === "pending" &&
        <button
          disabled={loading}
          onClick={() => updateOrderStatus("confirmed")}
          className={`button2 px-4 py-2 cursor-pointer ${orderStatus === "confirmed" ? "bg-foreground! text-background_1!" : ""}`}
        >
          Confirm
        </button>
      }

      {orderStatus === "confirmed" &&
        <button
          disabled={loading}
          onClick={() => updateOrderStatus("processing")}
          className={`button2 px-4 py-2 cursor-pointer ${orderStatus === "processing" ? "bg-foreground! text-background_1!" : ""}`}
        >
          Start packing order
        </button>
      }

      {orderStatus === "processing" &&
        <button
          disabled={loading}
          onClick={() => updateOrderStatus("packed")}
          className={`button2 px-4 py-2 cursor-pointer ${orderStatus === "packed" ? "bg-foreground! text-background_1!" : ""}`}
        >
          Order packed
        </button>
      }

      {orderStatus === "packed" &&
        <button
          disabled={loading}
          onClick={() => updateOrderStatus("shipped")}
          className={`button2 px-4 py-2 cursor-pointer ${orderStatus === "shipped" ? "bg-foreground! text-background_1!" : ""}`}
        >
          Shipped
        </button>
      }

      {orderStatus === "shipped" &&

        <button
          disabled={loading}
          onClick={() => updateOrderStatus("delivered")}
          className={`button2 px-4 py-2 cursor-pointer ${orderStatus === "delivered" ? "bg-foreground! text-background_1!" : ""}`}
        >
          Delivered
        </button>
      }
    </div>
  );
}