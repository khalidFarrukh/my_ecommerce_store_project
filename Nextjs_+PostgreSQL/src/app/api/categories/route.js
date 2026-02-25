// MongoDB version:
// import clientPromise from "@/lib/mongodb";
//
// export async function GET() {
//   const client = await clientPromise;
//   const db = client.db("my_ecommerce_db");
//
//   const categories = await db
//     .collection("categories")
//     .find({})
//     .toArray();
//
//   return Response.json(categories);
// }

import { categories } from "../data";

export async function GET(request) {
  return new Response(JSON.stringify(categories), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
