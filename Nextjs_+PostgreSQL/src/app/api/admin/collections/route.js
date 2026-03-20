import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const offset = Math.max(Number(url.searchParams.get("offset") || "0"), 0);
  const limit = Math.min(Number(url.searchParams.get("limit") || "20"), 50);

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const filter = search
    ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { id: { $regex: search, $options: "i" } },
      ],
    }
    : {};

  const total = await db.collection("collections").countDocuments(filter);

  const collections = await db
    .collection("collections")
    .find(filter)
    .sort({ orderNo: 1 })
    .skip(offset)
    .limit(limit)
    .toArray();

  const formatted = collections.map(c => ({
    ...c,
    _id: c._id.toString(),
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


