// import clientPromise from "@/lib/mongodb";

// export async function GET() {
//   const client = await clientPromise;
//   const db = client.db("my_ecommerce_db");

//   const collections = await db
//     .collection("collections") // your homepage collections
//     .find({})
//     .toArray();

//   return Response.json(collections);
// }


import { collections } from "../data";

export async function GET() {
  return new Response(JSON.stringify(collections), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}