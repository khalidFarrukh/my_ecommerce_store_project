import clientPromise from "@/lib/mongodb";

export async function GET(req, context) {
  try {
    // =========================
    // 1️⃣ Validate params
    // =========================
    const params = await context?.params;

    if (!params || !params.category || !params.product_slug) {
      return Response.json(
        { message: "Invalid parameters" },
        { status: 400 }
      );
    }

    const { category, product_slug } = params;

    // =========================
    // 2️⃣ Normalize + sanitize slug
    // =========================
    const normalizedSlug = product_slug
      .toLowerCase()
      .replace(/-/g, " ")
      .trim();

    // Prevent regex injection
    const escapedSlug = normalizedSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // =========================
    // 3️⃣ Connect to DB safely
    // =========================
    let client;
    try {
      client = await clientPromise;
    } catch (err) {
      console.error("❌ Mongo connection failed:", err);

      return Response.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const db = client.db("my_ecommerce_db");

    if (!db) {
      return Response.json(
        { message: "Database not available" },
        { status: 500 }
      );
    }

    // =========================
    // 4️⃣ Query product
    // =========================
    let product;
    try {
      product = await db.collection("products").findOne({
        category,
        name: {
          $regex: `^${escapedSlug}$`,
          $options: "i",
        },
        status: "active",
      });
    } catch (err) {
      console.error("❌ Query failed:", err);

      return Response.json(
        { message: "Database query failed" },
        { status: 500 }
      );
    }

    // =========================
    // 5️⃣ Not found
    // =========================
    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // =========================
    // 6️⃣ Safe serialization
    // =========================
    const formattedProduct = {
      ...product,
      _id: product._id?.toString?.() ?? null,
    };

    console.log(formattedProduct);

    // =========================
    // 7️⃣ Success response
    // =========================
    return Response.json(formattedProduct, {
      status: 200,
      headers: {
        "Cache-Control": "no-store", // prevent stale/broken cache
      },
    });

  } catch (err) {
    // =========================
    // 8️⃣ Catch ALL fallback
    // =========================
    console.error("🔥 Unhandled API error:", err);

    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}