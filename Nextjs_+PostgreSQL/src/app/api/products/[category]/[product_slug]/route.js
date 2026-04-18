import clientPromise from "@/lib/mongodb";

export async function GET(req, context) {
  const { category, product_slug } = await context.params;

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  // Fetch product by category and slugified name
  const product = await db.collection("products").findOne({
    category,
    name: { $regex: `^${product_slug.replace(/-/g, " ")}$`, $options: "i" },
    status: "active",
  });

  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found12" }), {
      status: 404,
    });
  }

  // Convert _id to string for frontend
  const formattedProduct = {
    ...product,
    _id: product._id.toString(),
  };

  return new Response(JSON.stringify(formattedProduct), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}



// import { products } from "@/app/api/data";
// import { convertTextStringToDashString } from "@/utils/utilities";

// export async function GET(req, context) {
//   const { category, product_slug } = await context.params;
//   const product_data = products.find(item => item.category === category && convertTextStringToDashString(item.name) === product_slug) ?? null;
//   if (!product_data) {
//     return new Response(JSON.stringify({ error: "Product not found" }), {
//       status: 404,
//     });
//   }

//   return new Response(JSON.stringify(product_data), {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }