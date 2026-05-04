import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

// ==========================
// ZOD SCHEMAS
// ==========================
const OptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string(),
});

const ImageSchema = z.object({
  id: z.string(),
  src: z.string().url(),
  alt: z.string().optional(),
});

const VariantSchema = z.object({
  id: z.string(),
  options: z.array(OptionSchema),
  price: z.number().nonnegative(),
  discount: z.number().min(0).max(100),
  stock: z.number().int().nonnegative(),
  default: z.boolean(),
  images: z.array(ImageSchema),
});

const ProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  variants: z.array(VariantSchema).optional(),
  category: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

// ==========================
// API ROUTE
// ==========================
export async function PUT(req, context) {
  const authSession = await auth();

  // ==========================
  // AUTH CHECK
  // ==========================
  if (!authSession?.user?.id || authSession.user.role !== "ADMIN") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { product_id } = await context.params;

  // ==========================
  // VALIDATE ID
  // ==========================
  if (!ObjectId.isValid(product_id)) {
    return Response.json({ message: "Invalid product ID" }, { status: 400 });
  }

  // ==========================
  // PARSE BODY
  // ==========================
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { _id, ...updateData } = body;

  // ==========================
  // ZOD VALIDATION
  // ==========================
  const parsed = ProductSchema.safeParse(updateData);

  if (!parsed.success) {
    return Response.json(
      {
        message: "Data Validation failed",

      },
      { status: 400 }
    );
  }

  const safeData = parsed.data;

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const session = client.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      // ==========================
      // CATEGORY UPSERT (atomic)
      // ==========================
      const categorySlug = safeData.category?.toLowerCase();

      if (categorySlug) {
        await db.collection("categories").updateOne(
          { _id: categorySlug },
          {
            $setOnInsert: {
              name: safeData.category,
              createdAt: new Date(),
            },
          },
          {
            upsert: true,
            session,
          }
        );
      }

      // ==========================
      // PRODUCT UPDATE
      // ==========================
      result = await db.collection("products").updateOne(
        { _id: new ObjectId(product_id) },
        {
          $set: {
            ...safeData,
            category: categorySlug,
            updatedAt: new Date(),
          },
        },
        { session }
      );

      if (result.matchedCount === 0) {
        throw new Error("PRODUCT_NOT_FOUND");
      }
    });

    return Response.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (err) {
    console.error("Transaction error:", err);

    if (err.message === "PRODUCT_NOT_FOUND") {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    return Response.json(
      { message: "Transaction failed" },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}