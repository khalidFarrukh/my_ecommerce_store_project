import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const session = await auth();

  if (!session || session?.user?.role !== "ADMIN") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const url = new URL(req.url);

  const offset = parseInt(url.searchParams.get("offset") || "0");
  const limit = parseInt(url.searchParams.get("limit") || "20");

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const total = await db.collection("products").countDocuments();

  const products = await db
    .collection("products")
    .find({})
    .skip(offset)
    .limit(limit)
    .toArray();

  const formatted = products.map(p => ({
    ...p,
    _id: p._id.toString(),
  }));

  return new Response(
    JSON.stringify({
      total,
      offset,
      limit,
      data: formatted,
      hasMore: offset + limit < total,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}