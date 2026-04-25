"use client";

import { useRouter } from "next/navigation";
import { authEvents } from "@/lib/authEvents";
import { useState } from "react";

export default function CancelOrderButton({ orderId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to cancel order");
      }

      authEvents.emit("auth:success", {
        message: "Order cancelled successfully",
      });

      router.refresh(); // 🔥 re-fetch server data
    } catch (err) {
      authEvents.emit("auth:error", {
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="px-3 py-1 text-sm rounded-md cursor-pointer bg-[darkred] hover:bg-[red] text-white disabled:opacity-50"
    >
      {loading ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}