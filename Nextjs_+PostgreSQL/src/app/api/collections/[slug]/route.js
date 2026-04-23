import clientPromise from "@/lib/mongodb";

export async function GET(req, context) {
  const { slug } = await context.params;
  const url = new URL(req.url);

  const type = url.searchParams.get("type") || "collection";

  const minPrice = parseFloat(url.searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(url.searchParams.get("maxPrice") || "Infinity");

  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  const skip = (page - 1) * limit;

  let matchStage = { status: "active" };

  if (type === "collection") {
    if (slug !== "all-products") {
      matchStage.collectionIds = slug;
    }
  } else if (type === "category") {
    matchStage.category = slug;
  }

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const result = await db.collection("products").aggregate([
    { $match: matchStage },
    { $unwind: "$variants" },

    {
      $addFields: {
        priceNum: { $toDouble: "$variants.price" },
        discountNum: { $toDouble: "$variants.discount" },
      }
    },

    {
      $addFields: {
        finalPrice: {
          $subtract: [
            "$priceNum",
            {
              $multiply: [
                "$priceNum",
                { $divide: ["$discountNum", 100] }
              ]
            }
          ]
        }
      }
    },

    {
      $facet: {
        products: [
          {
            $match: {
              finalPrice: { $gte: minPrice, $lte: maxPrice }
            }
          },

          {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              description: { $first: "$description" },
              category: { $first: "$category" },
              collectionIds: { $first: "$collectionIds" },
              status: { $first: "$status" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              info: { $first: "$info" },

              variants: {
                $push: {
                  id: "$variants.id",
                  options: "$variants.options",
                  price: "$variants.price",
                  discount: "$variants.discount",
                  stock: "$variants.stock",
                  default: "$variants.default",
                  images: "$variants.images"
                }
              }
            }
          },

          { $skip: skip },
          { $limit: limit },
          { $sort: { createdAt: -1 } }
        ],

        count: [
          {
            $match: {
              finalPrice: { $gte: minPrice, $lte: maxPrice }
            }
          },
          { $group: { _id: "$_id" } },
          { $count: "total" }
        ],

        priceRange: [
          {
            $group: {
              _id: null,
              minPrice: { $min: "$finalPrice" },
              maxPrice: { $max: "$finalPrice" }
            }
          }
        ]
      }
    }
  ]).toArray();

  const products_data = result[0].products;
  const total = result[0].count[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const priceRange = result[0].priceRange[0] || { minPrice: 0, maxPrice: 0 };

  const formattedProducts = products_data.map(p => ({
    ...p,
    _id: p._id.toString()
  }));

  return new Response(JSON.stringify({
    total,
    page,
    totalPages,
    priceRange,
    data: formattedProducts
  }), {
    headers: { "Content-Type": "application/json" }
  });
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


