import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req, context) {
  const session = await auth();

  if (!session || session?.user?.role !== "ADMIN") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { product_id } = await context.params;

  const body = await req.json();
  // Remove _id so MongoDB doesn't try to update it
  const { _id, ...updateData } = body;

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const categorySlug = updateData.category?.toLowerCase();
  if (categorySlug) {
    const existingCategory = await db
      .collection("categories")
      .findOne({ _id: categorySlug });

    if (!existingCategory) {
      await db.collection("categories").insertOne({
        _id: categorySlug,
        name: updateData.category,
        createdAt: new Date(),
      });
    }
  }

  const result = await db.collection("products").updateOne(
    { _id: new ObjectId(product_id) },
    {
      $set: {
        ...updateData,
        category: updateData.category.toLowerCase(),
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Product updated successfully",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}