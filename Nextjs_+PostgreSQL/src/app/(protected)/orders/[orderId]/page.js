import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import OrderClient from "./OrderClient";

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

  if (!order) {
    notFound(); // IMPORTANT
  }

  // ✅ convert Mongo ObjectId
  const safeOrder = {
    ...order,
    _id: order._id.toString(),
  };

  return <OrderClient order={safeOrder} />
}