import React from "react";
import clientPromise from "@/lib/mongodb";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  // =========================
  // 🕒 Recent Orders (last 2 days)
  // =========================
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const recentOrdersRaw = await db
    .collection("orders")
    .find({
      status: "pending",
      createdAt: { $gte: twoDaysAgo },
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  const recentOrders = recentOrdersRaw.map((o) => ({
    ...o,
    _id: o._id.toString(),
  }));

  // =========================
  // 📦 Low Stock Products (< 10)
  // =========================
  const lowStockProductsRaw = await db.collection("products")
    .find({
      variants: {
        $elemMatch: {
          stock: { $lt: 10 }
        }
      },
      status: "active"
    })
    .toArray();

  const lowStockProducts = lowStockProductsRaw.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));

  // =========================
  // 📊 Stats
  // =========================
  const totalProducts = await db.collection("products").countDocuments({
    status: "active",
  });
  const totalOrders = await db.collection("orders").countDocuments();

  const revenueAgg = await db.collection("orders").aggregate([
    {
      $match: {
        status: "delivered", // 🔥 only delivered orders
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$pricing.total" },
      },
    },
  ]).toArray();

  return (
    <AdminDashboardClient
      recentOrders={recentOrders}
      lowStockProducts={lowStockProducts}
      totalProducts={totalProducts}
      totalOrders={totalOrders}
      revenueAgg={revenueAgg}
    />
  );
}