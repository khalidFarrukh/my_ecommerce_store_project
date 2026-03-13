import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.toLowerCase().trim() || "";

    if (!q) {
      return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    const client = await clientPromise;
    const db = client.db("my_ecommerce_db");

    // MongoDB query to match name, description, category, or variants.options
    const regex = new RegExp(q, "i"); // case-insensitive

    const products = await db.collection("products").find({
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
        { "variants.options": { $elemMatch: { $exists: true } } } // we will filter options in code below
      ]
    }).toArray();

    // Filter variants.options in JS because Mongo can't directly match dynamic object keys
    const filteredProducts = products.filter(product => {
      if (regex.test(product.name) || regex.test(product.description) || regex.test(product.category)) {
        return true;
      }

      if (product.variants?.some(variant => {
        const options = variant.options || {};
        return Object.entries(options).some(([key, value]) => {
          return regex.test(key) || regex.test(String(value));
        });
      })) {
        return true;
      }

      return false;
    });

    // Convert _id to string for frontend
    const formattedProducts = filteredProducts.map(p => ({ ...p, _id: p._id.toString() }));

    return new Response(JSON.stringify(formattedProducts), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Search error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}


// import { products } from "../data";

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const q = searchParams.get("q")?.toLowerCase().trim() || "";

//   if (!q) {
//     return Response.json([]);
//   }

//   const filtered = products.filter((product) => {
//     const nameMatch = product.name?.toLowerCase().includes(q);
//     const descriptionMatch = product.description
//       ?.toLowerCase()
//       .includes(q);
//     const categoryMatch = product.category
//       ?.toLowerCase()
//       .includes(q);

//     const variantsMatch = product.variants?.some((variant) => {
//       const options = variant.options || {};

//       return Object.entries(options).some(([key, value]) => {
//         const keyStr = String(key).toLowerCase();
//         const valStr = String(value).toLowerCase();
//         return keyStr.includes(q) || valStr.includes(q);
//       });
//     });

//     return nameMatch || descriptionMatch || categoryMatch || variantsMatch;
//   });

//   return Response.json(filtered);
// }