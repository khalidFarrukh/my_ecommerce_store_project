import React from "react";
import clientPromise from "@/lib/mongodb";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");


  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const [
    recentOrdersRaw,
    lowStockProductsRaw,
    totalProducts,
    totalOrders,
    revenueAgg,
  ] = await Promise.all([
    db.collection("orders")
      .find({
        status: "pending",
        createdAt: { $gte: twoDaysAgo },
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray(),

    db.collection("products")
      .find({
        variants: { $elemMatch: { stock: { $lt: 10 } } },
        status: "active",
      })
      .toArray(),

    db.collection("products").countDocuments({ status: "active" }),

    db.collection("orders").countDocuments(),

    db.collection("orders")
      .aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$pricing.total" } } },
      ])
      .toArray(),
  ]);

  const recentOrders = recentOrdersRaw.map((o) => ({
    ...o,
    _id: o._id.toString(),
  }));

  const lowStockProducts = lowStockProductsRaw.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));

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