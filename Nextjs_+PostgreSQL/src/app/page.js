import HomeMainSection from "@/components/HomeMainSection";
import clientPromise from "@/lib/mongodb";
import { convertTextStringToDashString, getCollections } from "@/utils/utilities";


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

  return (
    <>
      <div
        classcategory=
        {`
          z-[1]
          relative
          w-full
          bg-white
          my-5
          flex
          flex-col
          items-center
        `}
      >
        <div className=
          {`
            mt-6
            lg:mt-12
          `} />
        {
          collections.map((collection, index) => {

            if (Boolean(!collection?.turnedoff && (collection?.hasProducts || collection?.slug === "all-products"))) {
              // console.log()
              return (
                <HomeMainSection key={index} collection_name={collection.name} collection_route={collection.slug} />
              )
            }
          })
        }
      </div>
    </>
  )
}
