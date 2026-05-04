import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getVariantPricing } from "@/utils/productVariant";
import { auth } from "@/auth";
import { getShippingPrice } from "@/utils/shipping";
import { parseDimensions, parseWeight } from "@/utils/utilities";

export async function POST(req) {
  const session = await auth();
  try {
    const body = await req.json();

    const { items, shippingAddress, payment } = body;

    if (!items || !items.length) {
      return NextResponse.json(
        { message: "No items provided" },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { message: "Shipping address required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("my_ecommerce_db");
    const productsCollection = db.collection("products");
    const ordersCollection = db.collection("orders");

    let verifiedItems = [];
    let subtotal = 0;
    let totalChargeableWeight = 0;

    // 🔥 VERIFY ITEMS AGAINST DATABASE
    for (const item of items) {
      const product = await productsCollection.findOne({
        _id: new ObjectId(item.productId),
      });

      if (!product) {
        return NextResponse.json(
          { message: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      const variant = product.variants.find(
        (v) => v.id === item.variantId
      );

      if (!variant) {
        return NextResponse.json(
          { message: `Variant not found` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const { price, discount, finalPrice } = getVariantPricing(variant);

      const total = finalPrice * item.quantity;
      subtotal += total;

      // =========================
      // 🚚 SHIPPING WEIGHT LOGIC
      // =========================

      const weight = parseWeight(product.info?.weight);

      const [l, w, h] = parseDimensions(product.info?.dimensions);

      let volumetricWeight = 0;

      if (l && w && h) {
        volumetricWeight = (l * w * h) / 5000;
      }

      const chargeableWeight = Math.max(weight, volumetricWeight);

      totalChargeableWeight += chargeableWeight * item.quantity;

      // =========================
      // PUSH ITEM
      // =========================
      verifiedItems.push({
        productId: product._id.toString(),
        productName: product.name,

        variantId: variant.id,
        options: variant.options,

        image: variant.images?.[0]?.src || "",

        price,
        discount,
        finalPrice,

        quantity: item.quantity,
        total,
      });
    }

    // 🚚 SHIPPING (you can improve this later)
    const shippingFee = getShippingPrice(totalChargeableWeight);

    const totalAmount = subtotal + shippingFee;

    // 🧾 CREATE ORDER OBJECT
    const order = {
      userId: session?.user?.id, // replace with auth later
      userEmail: session?.user?.email,

      items: verifiedItems,

      pricing: {
        subtotal,
        shippingFee,
        total: totalAmount,
      },

      shippingAddress,

      status: "pending",

      payment: {
        method: payment?.method || "cod",
        status: payment?.method === "cod" ? "pending" : "pending"
      },

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // // 📦 INSERT ORDER
    // const result = await ordersCollection.insertOne(order);

    // // 🔥 REDUCE STOCK (IMPORTANT)
    // for (const item of verifiedItems) {
    //   await productsCollection.updateOne(
    //     {
    //       _id: new ObjectId(item.productId),
    //       "variants.id": item.variantId,
    //     },
    //     {
    //       $inc: {
    //         "variants.$.stock": -item.quantity,
    //       },
    //     }
    //   );
    // }

    let result;
    const sessionDb = client.startSession();

    try {
      await sessionDb.withTransaction(async () => {
        result = await ordersCollection.insertOne(order, { session: sessionDb });

        // 🔴 Critical check inside transaction
        if (!result?.insertedId) {
          throw new Error("Order insertion failed");
        }

        for (const item of verifiedItems) {
          const updateRes = await productsCollection.updateOne(
            {
              _id: new ObjectId(item.productId),
              "variants.id": item.variantId,
            },
            {
              $inc: {
                "variants.$.stock": -item.quantity,
              },
            },
            { session: sessionDb }
          );

          // 🔴 Ensure stock was actually updated
          if (updateRes.modifiedCount === 0) {
            throw new Error(`Stock update failed for product ${item.productId}`);
          }
        }
      });

    } catch (error) {
      console.error("Transaction failed:", error);

      return NextResponse.json(
        { message: err.message || "Order processing failed" },
        { status: 500 }
      );
    } finally {
      await sessionDb.endSession();
    }

    // 🔴 Final safety check (outside transaction)
    if (!result?.insertedId) {
      return NextResponse.json(
        { message: "Order creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Order placed successfully!",
      orderId: result.insertedId,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}