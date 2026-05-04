import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const session = await auth();

    // 1. Auth check
    if (!session) {
      return Response.json(
        { message: "Unauthorized: No session found" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return Response.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const client = await clientPromise;

    // 2. DB connection safety check
    if (!client) {
      return Response.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const db = client.db("my_ecommerce_db");

    // // 3. Prevent duplicate accidental creation (optional safety layer)
    // // e.g. if frontend retries request
    // const existingDraft = await db.collection("products").findOne({
    //   status: "draft",
    //   name: "",
    //   sellerId: "default_seller",
    // });

    // if (existingDraft) {
    //   return Response.json({
    //     id: existingDraft._id,
    //     message: "Draft product already exists",
    //   });
    // }

    // 4. Insert product safely
    const result = await db.collection("products").insertOne({
      name: "",
      description: "",
      variants: [],
      info: {
        material: "",
        weight: "",
        country_of_origin: "",
        dimensions: "",
        type: ""
      },
      collectionIds: [],
      category: "",
      status: "draft",
      sellerId: "default_seller",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 5. Insert failure check
    if (!result?.insertedId) {
      return Response.json(
        { message: "Failed to create product" },
        { status: 500 }
      );
    }

    return Response.json({
      id: result.insertedId,
      message: "Product created successfully"
    });

  } catch (err) {
    console.error("CREATE_PRODUCT_ERROR:", err);

    // 6. Handle known Mongo / runtime issues cleanly
    return Response.json(
      {
        message: "Internal server error while creating product",
        details: process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}