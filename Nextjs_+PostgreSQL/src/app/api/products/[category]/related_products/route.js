// import clientPromise from "@/lib/mongodb";

// export async function GET(req, context) {
//   try {
//     // ✅ unwrap params (Next.js App Router rule)
//     const { category } = await context.params;

//     // ✅ connect to DB
//     const client = await clientPromise;
//     const db = client.db("my_ecommerce_db");

//     // ✅ fetch products by category
//     const products_data = await db
//       .collection("products")
//       .find({ category })
//       .toArray();

//     // ✅ handle empty result
//     if (!products_data.length) {
//       return new Response(
//         JSON.stringify({ error: "No products found" }),
//         { status: 404 }
//       );
//     }

//     // ✅ convert ObjectId to string
//     const formattedProducts = products_data.map(p => ({
//       ...p,
//       _id: p._id.toString()
//     }));

//     return new Response(JSON.stringify(formattedProducts), {
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });

//   } catch (error) {
//     console.error("Category API Error:", error);

//     return new Response(
//       JSON.stringify({ error: "Server Error" }),
//       { status: 500 }
//     );
//   }
// }

import { products } from "../../../data";

export async function GET(req, context) {
  const { category } = await context.params;

  const url = new URL(req.url);

  // Query params
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const limit = parseInt(url.searchParams.get("limit") || "4");
  const exclude = url.searchParams.get("exclude");

  // 1️⃣ Filter by category
  let filteredProducts = products.filter(
    item => item.category === category
  );

  // 2️⃣ Exclude selected product (for related section)
  if (exclude) {
    filteredProducts = filteredProducts.filter(
      item => item._id !== exclude
    );
  }

  const total = filteredProducts.length;

  // 3️⃣ Pagination
  const paginatedProducts = filteredProducts.slice(
    offset,
    offset + limit
  );

  return new Response(
    JSON.stringify({
      total,
      offset,
      limit,
      data: paginatedProducts,
      hasMore: offset + limit < total,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
