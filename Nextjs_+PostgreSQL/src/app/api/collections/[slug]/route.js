import clientPromise from "@/lib/mongodb";

export async function GET(req, context) {
  const { slug } = await context.params;
  const url = new URL(req.url);

  const offset = parseInt(url.searchParams.get("offset") || "0");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const type = url.searchParams.get("type") || "collection";

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  let query = { status: "active" };

  if (type === "collection") {
    if (slug !== "all-products") {
      // match items where collectionIds array contains slug
      query = { ...query, collectionIds: slug };
    }
  }

  else if (type === "category") {
    query = { ...query, category: slug };
  }

  const total = await db.collection("products").countDocuments(query);

  const products_data = await db
    .collection("products")
    .find(query)
    .skip(offset)
    .limit(limit)
    .toArray();

  const formattedProducts = products_data.map(p => ({
    ...p,
    _id: p._id.toString()
  }));

  return new Response(
    JSON.stringify({
      total,
      offset,
      limit,
      data: formattedProducts,
      hasMore: offset + limit < total
    }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
}


// import { products } from "../../data";

// export async function GET(req, context) {
//   const { collection_route } = await context.params;
//   const url = new URL(req.url);

//   // Get query params
//   const offset = parseInt(url.searchParams.get("offset") || "0"); // default 0
//   const limit = parseInt(url.searchParams.get("limit") || "10"); // default 10 per request
//   const type = url.searchParams.get("type") || "collection";
//   let products_data = [];
//   if (type === "collection") {
//     if (collection_route === "all-products") {
//       products_data = [...products];
//     } else {
//       products_data = products.filter(item => item.collectionIds.includes(collection_route));
//     }
//   }
//   else if (type === "category") {
//     products_data = products.filter(item => item.category === collection_route);
//   }
//   if (!products_data) {
//     return new Response(JSON.stringify({ error: "Product not found" }), {
//       status: 404,
//     });
//   }

//   // Slice the array for "load more"
//   const nextProducts = products_data.slice(offset, offset + limit);

//   const response = {
//     total: products_data.length,
//     offset,
//     limit,
//     data: nextProducts,
//     hasMore: offset + limit < products_data.length, // frontend can use this to know if more exists
//   };

//   return new Response(JSON.stringify(response), {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }


