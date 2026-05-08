import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    // =========================
    // 🔐 Auth Check
    // =========================
    const session = await auth();

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session?.user?.role !== "ADMIN") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // =========================
    // 🗄 DB Connection
    // =========================
    const client = await clientPromise;

    if (!client) {
      return Response.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const db = client.db("my_ecommerce_db");

    // =========================
    // 📅 Date Setup
    // =========================
    const twoDaysAgo = new Date();

    if (isNaN(twoDaysAgo.getTime())) {
      return Response.json(
        { message: "Server error" },
        { status: 500 }
      );
    }

    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // =========================
    // 🚀 Parallel Queries
    // =========================
    const [
      recentOrdersRaw,
      lowStockProductsRaw,
      totalProducts,
      totalOrders,
      revenueAgg,
    ] = await Promise.all([
      db
        .collection("orders")
        .find({
          status: "pending",
          createdAt: { $gte: twoDaysAgo },
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray(),

      db
        .collection("products")
        .find({
          variants: {
            $elemMatch: {
              stock: { $lt: 10 },
            },
          },
          status: "active",
        })
        .toArray(),

      db
        .collection("products")
        .countDocuments({
          status: "active",
        }),

      db
        .collection("orders")
        .countDocuments(),

      db
        .collection("orders")
        .aggregate([
          {
            $match: {
              status: "delivered",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$pricing.total",
              },
            },
          },
        ])
        .toArray(),
    ]);

    // =========================
    // 🧹 Safe Formatting
    // =========================
    const recentOrders = Array.isArray(recentOrdersRaw)
      ? recentOrdersRaw.map((o) => ({
        ...o,
        _id: o?._id?.toString?.() || "",
      }))
      : [];

    const lowStockProducts = Array.isArray(lowStockProductsRaw)
      ? lowStockProductsRaw.map((p) => ({
        ...p,
        _id: p?._id?.toString?.() || "",
      }))
      : [];

    // =========================
    // 💰 Revenue Fallback
    // =========================
    const revenue =
      Array.isArray(revenueAgg) &&
        revenueAgg.length > 0 &&
        typeof revenueAgg[0]?.total === "number"
        ? revenueAgg[0].total
        : 0;

    // =========================
    // ✅ Success Response
    // =========================
    return Response.json(
      {
        success: true,

        data: {
          recentOrders,
          lowStockProducts,

          stats: {
            totalProducts:
              typeof totalProducts === "number"
                ? totalProducts
                : 0,

            totalOrders:
              typeof totalOrders === "number"
                ? totalOrders
                : 0,

            revenue,
          },
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN DASHBOARD API ERROR:", err);

    return Response.json(
      {
        success: false,
        message:
          err?.message ||
          "Something went wrong while fetching dashboard data",
      },
      { status: 500 }
    );
  }
}