import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  const { category } = await context.params;
  const url = new URL(req.url);

  const offset = parseInt(url.searchParams.get("offset") || "0");
  const limit = parseInt(url.searchParams.get("limit") || "4");
  const exclude = url.searchParams.get("exclude");

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const query = { category, status: "active" };

  if (exclude) {
    query._id = { $ne: new ObjectId(exclude) };
  }

  const total = await db.collection("products").countDocuments(query);

  const products = await db
    .collection("products")
    .find(query)
    .skip(offset)
    .limit(limit)
    .toArray();

  const formattedProducts = products.map(p => ({
    ...p,
    _id: p._id.toString()
  }));

  return new Response(
    JSON.stringify({
      total,
      offset,
      limit,
      data: formattedProducts,
      hasMore: offset + limit < total,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}


// import { products } from "../../../data";

// export async function GET(req, context) {
//   const { category } = await context.params;

//   const url = new URL(req.url);

//   // Query params
//   const offset = parseInt(url.searchParams.get("offset") || "0");
//   const limit = parseInt(url.searchParams.get("limit") || "4");
//   const exclude = url.searchParams.get("exclude");

//   // 1️⃣ Filter by category
//   let filteredProducts = products.filter(
//     item => item.category === category && item => item._id !== exclude
//   );

//   const total = filteredProducts.length;

//   // 2️⃣ Pagination
//   const paginatedProducts = filteredProducts.slice(
//     offset,
//     offset + limit
//   );

//   return new Response(
//     JSON.stringify({
//       total,
//       offset,
//       limit,
//       data: paginatedProducts,
//       hasMore: offset + limit < total,
//     }),
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// }
