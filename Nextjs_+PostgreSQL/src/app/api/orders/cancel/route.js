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

  if (order.status !== "pending") {
    return new Response("Cannot cancel this order", { status: 400 });
  }

  const sessionDb = client.startSession();

  try {
    await sessionDb.withTransaction(async () => {

      // 🔹 Prepare update
      const update = {
        status: "cancelled",
        updatedAt: new Date(),
      };

      if (order.payment.method === "cod") {
        update["payment.status"] = "cancelled";
      } else {
        if (order.payment.status === "paid") {
          update["payment.status"] = "refund_requested";
        } else {
          update["payment.status"] = "cancelled";
        }
      }

      // 🔹 Update order
      const updateRes = await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        { $set: update },
        { session: sessionDb }
      );

      if (updateRes.modifiedCount === 0) {
        throw new Error("Failed to update order");
      }

      // 🔥 Restore stock
      for (const item of order.items) {
        const stockRes = await db.collection("products").updateOne(
          {
            _id: new ObjectId(item.productId),
            "variants.id": item.variantId,
          },
          {
            $inc: {
              "variants.$.stock": item.quantity,
            },
          },
          { session: sessionDb }
        );

        if (stockRes.modifiedCount === 0) {
          throw new Error(`Failed to restore stock for ${item.productId}`);
        }
      }

    });

  } catch (err) {
    console.error("Cancel transaction failed:", err);

    return new Response(
      err.message || "Cancellation failed",
      { status: 500 }
    );
  } finally {
    await sessionDb.endSession();
  }

  return Response.json({ success: true });
}