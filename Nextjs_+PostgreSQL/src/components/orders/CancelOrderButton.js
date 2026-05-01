"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGlobalToast } from "@/context/GlobalToastContext";

export default function CancelOrderButton({ orderId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setToast } = useGlobalToast();

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
        throw new Error(data);
      }

      setToast({
        id: Date.now(),
        message: "Order cancelled successfully",
        type: "info"
      });

      router.refresh(); // 🔥 re-fetch server data
    } catch (err) {
      setToast({
        id: Date.now(),
        message: err.message || "Failed to cancel order",
        type: "error"
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