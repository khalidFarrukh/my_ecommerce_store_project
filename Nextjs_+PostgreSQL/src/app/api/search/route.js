import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const url = new URL(req.url);

    const q = url.searchParams.get("q")?.toLowerCase().trim() || "";

    const minPrice = Number(url.searchParams.get("minPrice") || 0);
    const maxPriceParam = url.searchParams.get("maxPrice");

    const maxPrice =
      maxPriceParam && maxPriceParam !== "Infinity"
        ? Number(maxPriceParam)
        : Number.MAX_SAFE_INTEGER;

    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const regex = new RegExp(q, "i");

    const client = await clientPromise;
    const db = client.db("my_ecommerce_db");

    const priceMatch = {};

    if (!isNaN(minPrice)) priceMatch.$gte = minPrice;
    if (!isNaN(maxPrice)) priceMatch.$lte = maxPrice;

    const result = await db.collection("products").aggregate([

      // 1️⃣ Match product-level filters
      {
        $match: {
          status: "active",
        }
      },

      // 2️⃣ explode variants
      { $unwind: "$variants" },

      // 3️⃣ 🔥 FILTER VARIANTS HERE
      ...(q
        ? [{
          $match: {
            $or: [
              { name: regex },
              { description: regex },
              { category: regex },
              { collectionIds: regex },
              // ✅ info search AGAIN
              {
                $expr: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: { $objectToArray: "$info" },
                          as: "item",
                          cond: {
                            $regexMatch: {
                              input: { $toString: "$$item.v" },
                              regex: q,
                              options: "i"
                            }
                          }
                        }
                      }
                    },
                    0
                  ]
                }
              },
              {
                "variants.options": {
                  $elemMatch: {
                    $or: [
                      { name: regex },
                      { value: regex }
                    ]
                  }
                }
              }
            ]
          }
        }]
        : []),

      // 3️⃣ compute final price per variant
      {
        $addFields: {
          finalPrice: {
            $ceil: {
              $subtract: [
                "$variants.price",
                {
                  $multiply: [
                    "$variants.price",
                    { $divide: ["$variants.discount", 100] }
                  ]
                }
              ]
            }
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

            { $sort: { createdAt: -1 } }, // 🔥 move before skip/limit (important)
            { $skip: skip },
            { $limit: limit }
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

  } catch (error) {
    console.error("Search error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
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