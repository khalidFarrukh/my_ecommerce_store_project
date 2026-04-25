import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { orderId } = await req.json();

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const order = await db.collection("orders").findOne({
    _id: new ObjectId(orderId),
    userId: session.user.id,
  });

  if (!order) {
    return new Response("Order not found", { status: 404 });
  }

  if (!["pending"].includes(order.status)) {
    return new Response("Cannot cancel this order", { status: 400 });
  }

  const update = {
    status: "cancelled",
    updatedAt: new Date(),
  };

  if (order.payment.method === "cod") {
    // never paid
    update["payment.status"] = "cancelled";
  } else {
    if (order.payment.status === "paid") {
      // money actually taken → refund needed
      update["payment.status"] = "refund_requested";
    } else { //here order.payment.status can be "pending" or "failed" → payment never completed, so just mark as cancelled, no refund needed
      // payment never completed → nothing to refund
      update["payment.status"] = "cancelled";
    }
  }

  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    { $set: update }
  );

  return Response.json({ success: true });
}