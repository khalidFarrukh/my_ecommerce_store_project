import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import AdminOrderActions from "./AdminOrderActions";
import NotFound from "@/components/NotFound";

export default async function AdminCertainOrderPage({ params }) {
  // const session = await auth();

  // 🔒 Only admin allowed
  // if (!session) {
  //   redirect("/signIn?callbackUrl=/admin");
  // }

  // if (session.user.role !== "ADMIN") {
  //   redirect("/");
  // }

  const { order_id } = await params;

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const order = await db.collection("orders").findOne({
    _id: new ObjectId(order_id),
  });

  if (!order) {
    notFound(); // IMPORTANT
  }

  // ✅ convert ObjectId
  const formattedOrder = {
    ...order,
    _id: order._id.toString(),
  };
  return (
    <section className="w-full max-w-4xl mx-auto py-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Order #{formattedOrder._id}
        </h1>

        <span className="px-3 py-1 text-sm rounded bg-background_2 border border-myBorderColor">
          {formattedOrder.status}
        </span>
      </div>

      {/* USER INFO */}
      <div className="border border-myBorderColor p-4 rounded bg-background_2 space-y-2">
        <h2 className="font-semibold">User</h2>
        <p className="text-sm">
          ID: {formattedOrder.userId || "Guest"}
        </p>
        <p className="text-sm">
          Email: {formattedOrder.userEmail || "N/A"}
        </p>
      </div>

      {/* PAYMENT */}
      <div className="border border-myBorderColor p-4 rounded bg-background_2 space-y-2">
        <h2 className="font-semibold">Payment</h2>
        <p>
          Method: {formattedOrder.payment?.method?.toUpperCase()}
        </p>
        <p>Status: {formattedOrder.payment?.status}</p>
      </div>

      {/* ITEMS */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Items</h2>

        {formattedOrder.items.map((item, i) => (
          <div
            key={i}
            className="flex gap-4 border border-myBorderColor rounded p-3 bg-background_2"
          >
            <img
              src={item.image}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded"
            />

            <div className="flex-1">
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm">Qty: {item.quantity}</p>
              <p className="text-sm">
                Rs. {item.finalPrice} × {item.quantity}
              </p>
            </div>

            <div className="font-semibold">
              Rs. {item.total}
            </div>
          </div>
        ))}
      </div>

      {/* ADDRESS */}
      <div className="border border-myBorderColor p-4 rounded bg-background_2">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p>{formattedOrder.shippingAddress.name}</p>
        <p>{formattedOrder.shippingAddress.phone}</p>
        <p>{formattedOrder.shippingAddress.city}</p>
        <p>{formattedOrder.shippingAddress.addressLine}</p>
      </div>

      {/* PRICING */}
      <div className="border  border-myBorderColor p-4 rounded bg-background_2 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs. {formattedOrder.pricing.subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Rs. {formattedOrder.pricing.shippingFee}</span>
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>Rs. {formattedOrder.pricing.total}</span>
        </div>
      </div>

      {/* ✅ CLIENT COMPONENT HERE */}
      <AdminOrderActions orderStatus={formattedOrder.status} orderId={formattedOrder._id} />
    </section>
  );
}