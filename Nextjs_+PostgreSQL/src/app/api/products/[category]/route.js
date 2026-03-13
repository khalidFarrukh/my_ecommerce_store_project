import clientPromise from "@/lib/mongodb";

export async function GET(req, context) {
  const { category } = await context.params;

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  // Find all products in the given category
  const products = await db
    .collection("products")
    .find({ category, status: "active" })
    .toArray();

  // Convert _id to string for frontend
  const formattedProducts = products.map(p => ({ ...p, _id: p._id.toString() }));

  return new Response(JSON.stringify(formattedProducts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// import { products } from "../../data";

// export async function GET(request, context) {
//   const { category } = await context.params;

//   const filteredProducts = products.filter(
//     (item) => item.category === category
//   );

//   return new Response(JSON.stringify(filteredProducts), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }
