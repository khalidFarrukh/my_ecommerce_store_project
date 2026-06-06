import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { BaseProductSchema, StrictProductSchema } from "@/schemas/productSchema";
import { buildOptionsFromVariantsByUnion } from "@/utils/buildOptionsFromVariantsByUnion";

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

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const dbProduct = await db.collection("products").findOne({ _id: new ObjectId(product_id) });

  if (dbProduct.status !== "draft") {
    // prevent changing product name
    if (updateData.name !== dbProduct.name) {
      return Response.json(
        {
          message:
            "Product name cannot be changed after activation",
        },
        { status: 400 }
      );
    }
  }

  const from = dbProduct.status;
  const to = updateData.status;

  const shouldValidate =
    (from === "draft" && to === "active") ||
    (from === "active" && to === "archive");

  if (from === "active" && to === "archive") {
    const hasStock = updateData.variants?.some(v => v.stock > 0);

    if (hasStock) {
      return Response.json({
        message: "Cannot archive product with stock remaining",
      }, { status: 400 });
    }
  }

  let safeData;

  if (shouldValidate) {
    const parsed = StrictProductSchema.safeParse(updateData);
    console.log("Validation result:", parsed);

    if (!parsed.success) {
      return Response.json({ message: "Validation failed" }, { status: 400 });
    }

    safeData = parsed.data;
  } else {
    const parsed = BaseProductSchema.partial().safeParse(updateData);
    console.log("Partial validation result:", parsed);

    if (!parsed.success) {
      return Response.json({ message: "Invalid Data" }, { status: 400 });
    }

    safeData = parsed.data;
  }

  const createShortFormString = (str) => {
    const wordArr = String(str).split(" ");
    let shortForm = [];
    wordArr.map(word => shortForm.push(word[0]))

    return shortForm.join('');
  }

  const normalizeSkuPart = (value) =>
    String(value)
      .trim()
      .replaceAll(" ", "_")
      .toUpperCase();

  const productBaseCode = createShortFormString(safeData.name);
  if (safeData.variants.length > 0) {
    const availableOptions = buildOptionsFromVariantsByUnion(safeData.variants);

    // STEP 1 → normalize all variants
    Object.entries(availableOptions).forEach(([label]) => {
      safeData.variants.forEach(variant => {
        if (variant.options.every(option => option.name !== label)) {
          variant.options.push({
            id: crypto.randomUUID(),
            name: label,
            value: "-",
          });
        }
      });
    });

    if (safeData.status === "active") {

      // STEP 2 → generate SKU only after normalization
      safeData.variants.forEach(variant => {
        variant.sku ??= "";

        if (variant?.sku !== "") return;

        const hasMissingOption = variant.options.some(
          option => option.value === "-"
        );

        if (!hasMissingOption) {
          variant.sku = [
            String(safeData._id).slice(-4),
            productBaseCode,
            ...variant.options.map(option => normalizeSkuPart(option.value))
          ].join("-");
        }
      });
    }
  }

  const session = client.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      // ==========================
      // CATEGORY UPSERT (atomic)
      // ==========================
      const categorySlug = safeData?.category?.toLowerCase();

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