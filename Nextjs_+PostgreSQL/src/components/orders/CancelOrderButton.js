"use client";

export default function CancelOrderButton({  handleCancel, cancelingOrder }) {

  return (
    <button
      onClick={handleCancel}
      disabled={cancelingOrder}
      className="px-3 py-1 text-sm rounded-md cursor-pointer bg-[darkred] hover:bg-[red] text-white disabled:opacity-50"
    >
      {cancelingOrder ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}