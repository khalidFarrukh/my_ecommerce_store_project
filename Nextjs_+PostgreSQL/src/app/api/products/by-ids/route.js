// import clientPromise from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { ids } = body;

//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return new Response(
//         JSON.stringify({ error: "Invalid or empty ids array" }),
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     const db = client.db("my_ecommerce_db");

//     // Convert string ids to ObjectIds safely
//     const objectIds = ids
//       .filter(id => ObjectId.isValid(id))
//       .map(id => new ObjectId(id));

//     if (!objectIds.length) {
//       return new Response(
//         JSON.stringify({ error: "No valid product ids" }),
//         { status: 400 }
//       );
//     }

//     const products = await db
//       .collection("products")
//       .find({ _id: { $in: objectIds } })
//       .toArray();

//     const formattedProducts = products.map(p => ({
//       ...p,
//       _id: p._id.toString()
//     }));

//     return new Response(JSON.stringify(formattedProducts), {
//       headers: { "Content-Type": "application/json" }
//     });

//   } catch (error) {
//     console.error("Error fetching products by ids:", error);

//     return new Response(
//       JSON.stringify({ error: "Server error" }),
//       { status: 500 }
//     );
//   }
// }


import { products } from "../../data";

export async function POST(req) {
  try {
    const body = await req.json();
    const { ids } = body;

    console.log(ids);
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or empty ids array" }),
        { status: 400 }
      );
    }

    // Ensure everything is string (safety)
    const stringIds = ids.map(id => String(id));

    // Filter products from mock data
    const matchedProducts = products.filter(product =>
      stringIds.includes(product._id)
    );

    if (!matchedProducts.length) {
      return new Response(
        JSON.stringify({ error: "No matching products found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(matchedProducts), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error fetching products by ids:", error);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
