import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const orders = await db
    .collection("orders")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const formatted = orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
  }));

  return Response.json({ data: formatted });
}