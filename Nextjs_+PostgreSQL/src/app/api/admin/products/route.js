import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const url = new URL(req.url);

  const status = url.searchParams.get("status");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const search = url.searchParams.get("search") || "";

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const total = await db.collection("products").countDocuments(query);

  const products = await db
    .collection("products")
    .find(query)
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 })
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