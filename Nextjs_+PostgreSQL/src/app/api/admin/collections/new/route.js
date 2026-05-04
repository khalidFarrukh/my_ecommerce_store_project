import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function POST() {
  try {
    // =========================
    // 🔐 AUTH CHECKS
    // =========================
    const session = await auth();

    if (!session?.user?.id || session?.user?.role !== "ADMIN") {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // =========================
    // 🗄️ DB CONNECTION SAFETY
    // =========================
    const client = await clientPromise;

    if (!client) {
      return Response.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const db = client.db("my_ecommerce_db");
    const collections = db.collection("collections");

    // =========================
    // ⚠️ EDGE CASE: EMPTY COLLECTION SAFETY
    // =========================
    const last = await collections
      .find({})
      .sort({ orderNo: -1 })
      .limit(1)
      .toArray();

    const nextOrder = last?.length ? last[0]?.orderNo + 1 : 1;

    // =========================
    // 🧠 UNIQUE SLUG SAFETY
    // =========================
    const baseSlug = "new-collection";
    let slug = baseSlug;

    let counter = 1;

    while (await collections.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // =========================
    // 📦 INSERT SAFELY
    // =========================
    const result = await collections.insertOne({
      name: "New Collection",
      slug,
      orderNo: nextOrder,
      turnedoff: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!result?.insertedId) {
      return Response.json(
        { message: "Failed to create collection" },
        { status: 500 }
      );
    }

    // =========================
    // ✅ SUCCESS RESPONSE
    // =========================
    return Response.json({
      success: true,
      id: result.insertedId.toString(),
    });

  } catch (err) {
    console.error("Create collection error:", err);

    // =========================
    // ❌ SAFE ERROR RESPONSE
    // =========================
    return Response.json(
      {
        message: "Internal server error",
        details: process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
      },
      { status: 500 }
    );
  }
}