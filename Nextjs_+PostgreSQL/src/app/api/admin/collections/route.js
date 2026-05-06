import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // =========================
    // 1. Auth check (robust)
    // =========================
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized: no session" },
        { status: 401 }
      );
    }

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden: admin access required" },
        { status: 403 }
      );
    }

    // =========================
    // 2. DB connection safety
    // =========================
    const client = await clientPromise;

    if (!client) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const db = client.db("my_ecommerce_db");

    if (!db) {
      return NextResponse.json(
        { message: "Database not available" },
        { status: 500 }
      );
    }

    // =========================
    // 3. Fetch data safely
    // =========================
    const [total, collections] = await Promise.all([
      db.collection("collections").countDocuments({}),
      db
        .collection("collections")
        .find({})
        .sort({ orderNo: 1 })
        .toArray(),
    ]);

    if (!Array.isArray(collections)) {
      return NextResponse.json(
        { message: "Invalid collections data" },
        { status: 500 }
      );
    }

    // =========================
    // 4. Defensive formatting
    // =========================
    const formatted = collections
      .filter(Boolean) // remove null/undefined docs
      .map((c) => ({
        ...c,
        _id: c?._id?.toString?.() || null,
        name: c?.name || "Untitled",
        orderNo: c?.orderNo ?? 0,
        turnedoff: Boolean(c?.turnedoff),
      }))
      .filter((c) => c._id); // ensure valid id

    // =========================
    // 5. Empty state safety
    // =========================
    if (formatted.length === 0) {
      return NextResponse.json({
        total: 0,
        data: [],
        message: "No collections found",
      });
    }

    // =========================
    // 6. Success response
    // =========================
    return NextResponse.json({
      total,
      data: formatted,
    },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      });
  } catch (err) {
    console.error("GET /admin/collections error:", err);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}