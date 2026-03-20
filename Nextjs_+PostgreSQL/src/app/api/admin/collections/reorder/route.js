import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  // 🔒 Auth check
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const updates = await req.json();

    // ❌ Validate input
    if (!Array.isArray(updates) || updates.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("my_ecommerce_db");

    // 🔥 Use bulk operation (fast & efficient)
    const bulkOps = updates.map((item) => ({
      updateOne: {
        filter: { _id: new ObjectId(item._id) },
        update: {
          $set: {
            orderNo: item.orderNo,
            updatedAt: new Date(),
          },
        },
      },
    }));

    const result = await db
      .collection("collections")
      .bulkWrite(bulkOps);

    return new Response(
      JSON.stringify({
        success: true,
        modifiedCount: result.modifiedCount,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Reorder error:", err);

    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}