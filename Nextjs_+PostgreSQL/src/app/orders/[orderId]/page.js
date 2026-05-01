import { auth } from "@/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import CancelOrderButton from "@/components/orders/CancelOrderButton";

export default async function OrderPage({ params }) {
  const session = await auth();
  const { orderId } = await params;
  if (!session?.user?.id) {
    if (!ObjectId.isValid(orderId)) {
      redirect("/");
    }
    redirect(`/signIn?callbackUrl=/orders/${orderId}&error=auth_required`);
  }

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");
  const ordersCollection = db.collection("orders");

  const order = await ordersCollection.findOne({
    _id: new ObjectId(orderId),
    userId: session.user.id, // 🔒 security: user can only see own order
  });

  // ✅ convert Mongo ObjectId
  const safeOrder = {
    ...order,
    _id: order._id.toString(),
  };

  if (!order) {
    return (
      <div className="p-6 text-center">
        Order not found
      </div>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto py-6 space-y-6">

      {/* HEADER */}
      <div className="flex gap-3 flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="order-2 md:order-1 text-sm md:text-2xl font-medium md:font-bold">
          Order #{safeOrder._id}
        </h1>

        {safeOrder.status === "pending" &&
          <div className="order-1 md:order-2 w-full md:w-fit flex justify-end gap-3">
            <CancelOrderButton orderId={safeOrder._id} />
          </div>
        }

      </div>

      {/* ORDER INFO */}
      <div className="border border-myBorderColor rounded-md p-4 bg-background_2 space-y-2">
        <p className="text-sm">
          <span className="text-myTextColorMain">Placed on:</span>{" "}
          {new Date(safeOrder.createdAt).toLocaleString()}
        </p>

        <p className="text-sm">
          <span className="text-myTextColorMain">Order status:</span>{" "}
          {safeOrder.status}
        </p>

        <p className="text-sm">
          <span className="text-myTextColorMain">Payment:</span>{" "}
          {safeOrder.payment.method.toUpperCase()} ({safeOrder.payment.status})
        </p>
      </div>

      {/* ITEMS */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Items</h2>

        {safeOrder.items.map((item, idx) => (
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

        <p>{safeOrder.shippingAddress.name}</p>
        <p>{safeOrder.shippingAddress.phone}</p>
        <p>{safeOrder.shippingAddress.city}</p>
        <p>{safeOrder.shippingAddress.addressLine}</p>
      </div>

      {/* PRICING */}
      <div className="border border-myBorderColor rounded-md p-4 bg-background_2 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs. {safeOrder.pricing.subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Rs. {safeOrder.pricing.shippingFee}</span>
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>Rs. {safeOrder.pricing.total}</span>
        </div>
      </div>
    </section>
  );
}