import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  const session = await auth();
  const { collection_id } = await context.params;
  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");
  const collection = await db.collection("collections").findOne({ _id: new ObjectId(collection_id) });

  if (!collection) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  return new Response(JSON.stringify({ data: collection }), { headers: { "Content-Type": "application/json" } });
}

export async function PUT(req, context) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { collection_id } = await context.params;
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  // 🔥 Check for duplicate (case-insensitive, excluding current doc)
  const existing = await db.collection("collections").findOne({
    _id: { $ne: new ObjectId(collection_id) },
    name: { $regex: `^${body.name}$`, $options: "i" },
  });

  if (existing) {
    return new Response(
      JSON.stringify({ error: "A collection with this name already exists." }),
      { status: 400 }
    );
  }

  await db.collection("collections").updateOne(
    { _id: new ObjectId(collection_id) },
    {
      $set: {
        name: body.name,
        slug: body.slug,
        turnedoff: body.turnedoff,
        updatedAt: new Date(),
      },
    }
  );

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collection_id } = await params;
    const client = await clientPromise;
    const db = client.db("my_ecommerce_db");

    const result = await db.collection("collections").deleteOne({
      _id: new ObjectId(collection_id),
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}