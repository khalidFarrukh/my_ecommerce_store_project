import HomePage from "@/components/HomePage";
import clientPromise from "@/lib/mongodb";


export default async function Home() {

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const collections = await db
    .collection("collections")
    .aggregate([
      {
        $lookup: {
          from: "products",
          let: { collectionSlug: "$slug" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$collectionSlug", "$collectionIds"] },
              },
            },
            { $limit: 1 }, // only need to know if at least 1 product exists
          ],
          as: "products",
        },
      },
      {
        $addFields: {
          hasProducts: { $gt: [{ $size: "$products" }, 0] },
        },
      },
      {
        $project: { products: 0 }, // remove unnecessary data
      },
      {
        $sort: { orderNo: 1 },
      },
    ])
    .toArray();

  const safeCollections = collections.map(col => ({
    ...col,
    _id: col._id.toString(),
  }));

  return <HomePage collections={safeCollections} />;
}
