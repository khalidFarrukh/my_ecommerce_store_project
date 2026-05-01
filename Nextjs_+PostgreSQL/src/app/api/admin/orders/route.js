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

  const orders = await db.collection("orders").aggregate([
    {
      $addFields: {
        statusOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "pending"] }, then: 1 },
              { case: { $eq: ["$status", "confirmed"] }, then: 2 },
              { case: { $eq: ["$status", "processing"] }, then: 3 },
              { case: { $eq: ["$status", "packed"] }, then: 4 },
              { case: { $eq: ["$status", "shipped"] }, then: 5 },
              { case: { $eq: ["$status", "delivered"] }, then: 6 },
              { case: { $eq: ["$status", "cancelled"] }, then: 7 },
            ],
            default: 99,
          },
        },
      },
    },
    {
      $sort: {
        statusOrder: 1,
        createdAt: -1,
      },
    },
  ]).toArray();

  const formatted = orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
  }));

  return Response.json({ data: formatted });
}