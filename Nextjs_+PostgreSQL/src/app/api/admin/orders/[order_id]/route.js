import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { order_id } = await params;
  const body = await req.json();
  const status = body.status;
  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const order = await db.collection("orders").findOne({
    _id: new ObjectId(order_id),
  });

  if (!order) {
    return new Response("Order not found", { status: 404 });
  }

  const allowedTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing"],
    processing: ["packed"],
    packed: ["shipped"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  if (!allowedTransitions[order.status]?.includes(status)) {
    return new Response(
      JSON.stringify({ error: "Invalid status transition" }),
      { status: 400 }
    );
  }

  const update = {
    status,
    updatedAt: new Date(),
  };

  if (status === "delivered") {
    if (order.payment.method === "cod") {
      update["payment.status"] = "paid";
    }
  }

  await db.collection("orders").updateOne(
    { _id: new ObjectId(order_id) },
    {
      $set: update,
    }
  );

  return Response.json({ success: true });
}

export async function POST(req, { params }) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { order_id } = await params;
  const formData = await req.formData();
  const status = formData.get("status");

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  await db.collection("orders").updateOne(
    { _id: new ObjectId(order_id) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.redirect(`/admin/orders/${order_id}`);
}