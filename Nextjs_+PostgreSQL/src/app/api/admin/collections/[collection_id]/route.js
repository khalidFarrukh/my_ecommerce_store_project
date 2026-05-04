import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import z from "zod";

export async function GET(req, context) {
  const session = await auth();
  const { collection_id } = await context.params;
  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");
  if (!ObjectId.isValid(collection_id)) {
    return Response.json({ message: "Invalid ID" }, { status: 400 });
  }
  try {
    // db logic
    const collection = await db.collection("collections").findOne({ _id: new ObjectId(collection_id) });

    if (!collection) return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
    return new Response(JSON.stringify({ data: collection }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

// =========================
// 🔐 Zod schema
// =========================
const updateCollectionSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  slug: z.string().min(2).max(100).trim(),
  turnedoff: z.boolean(),
});

// =========================
// 🔐 Escape regex helper
// =========================
const escapeRegex = (str) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function PUT(req, context) {
  // =========================
  // 1️⃣ Auth session
  // =========================
  const authSession = await auth();

  if (!authSession || authSession.user.role !== "ADMIN") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  // =========================
  // 2️⃣ Params validation
  // =========================
  const { collection_id } = await context.params;

  if (!ObjectId.isValid(collection_id)) {
    return Response.json({ message: "Invalid ID" }, { status: 400 });
  }

  // =========================
  // 3️⃣ Body validation (Zod)
  // =========================
  const body = await req.json();

  const parsed = updateCollectionSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: "Invalid input" },
      { status: 400 }
    );
  }

  const { name, slug, turnedoff } = parsed.data;

  // =========================
  // 4️⃣ DB + Transaction
  // =========================
  const client = await clientPromise;
  const dbSession = client.startSession();

  try {
    await dbSession.withTransaction(async () => {
      const db = client.db("my_ecommerce_db");

      // 🔍 Prevent regex injection
      const safeName = escapeRegex(name);

      // 🔍 Check duplicate
      const existing = await db.collection("collections").findOne(
        {
          _id: { $ne: new ObjectId(collection_id) },
          name: { $regex: `^${safeName}$`, $options: "i" },
        },
        { session: dbSession }
      );

      if (existing) {
        throw new Error("DUPLICATE");
      }

      // ✏️ Update
      const result = await db.collection("collections").updateOne(
        { _id: new ObjectId(collection_id) },
        {
          $set: {
            name,
            slug,
            turnedoff,
            updatedAt: new Date(),
          },
        },
        { session: dbSession }
      );

      if (result.matchedCount === 0) {
        throw new Error("NOT_FOUND");
      }
    });

    return Response.json({ success: true });

  } catch (err) {
    if (err.message === "DUPLICATE") {
      return Response.json(
        { message: "Collection already exists" },
        { status: 400 }
      );
    }

    if (err.message === "NOT_FOUND") {
      return Response.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    console.error("🔥 Transaction error:", err);

    return Response.json(
      { message: "Transaction failed" },
      { status: 500 }
    );
  } finally {
    await dbSession.endSession();
  }
}

// =========================
// 🔐 Zod schema (params)
// =========================
const paramsSchema = z.object({
  collection_id: z.string().min(2),
});

export async function DELETE(req, { params }) {
  // =========================
  // 1️⃣ Auth session
  // =========================
  const authSession = await auth();
  const rawParams = await params;

  if (!authSession || authSession.user.role !== "ADMIN") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  // =========================
  // 2️⃣ Validate params (Zod)
  // =========================
  const parsedParams = paramsSchema.safeParse(rawParams);

  if (!parsedParams.success) {
    return Response.json({ message: "Invalid parameters" }, { status: 400 });
  }

  const { collection_id } = parsedParams.data;

  // =========================
  // 3️⃣ Validate ObjectId
  // =========================
  if (!ObjectId.isValid(collection_id)) {
    return Response.json({ message: "Invalid ID" }, { status: 400 });
  }

  const client = await clientPromise;
  const dbSession = client.startSession();

  try {
    // =========================
    // 4️⃣ Transaction
    // =========================
    await dbSession.withTransaction(async () => {
      const db = client.db("my_ecommerce_db");

      // 🔥 Delete collection
      const result = await db.collection("collections").deleteOne(
        { _id: new ObjectId(collection_id) },
        { session: dbSession }
      );

      if (result.deletedCount === 0) {
        throw new Error("NOT_FOUND");
      }

      // // 🔥 Optional: cascade delete related products
      // await db.collection("products").deleteMany(
      //   { collection_id },
      //   { session: dbSession }
      // );
    });

    return Response.json({ success: true });

  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return Response.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    console.error("🔥 Transaction error:", err);

    return Response.json(
      { message: "Transaction failed" },
      { status: 500 }
    );
  } finally {
    await dbSession.endSession();
  }
}