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

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  await db.collection("orders").updateOne(
    { _id: new ObjectId(order_id) },
    {
      $set: {
        status: body.status,
        updatedAt: new Date(),
      },
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