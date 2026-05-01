import clientPromise from "@/lib/mongodb";

export async function GET(req) {

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");


  const total = await db.collection("collections").countDocuments({});

  const collections = await db
    .collection("collections")
    .find({})
    .sort({ orderNo: 1 })
    .toArray();

  const formatted = collections.map(c => ({
    ...c,
    _id: c._id.toString(),
  }));

  return new Response(
    JSON.stringify({
      total,
      data: formatted,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
