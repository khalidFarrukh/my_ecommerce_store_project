import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const addresses = await db
    .collection("addresses")
    .find({ user_id: session.user.id })
    .toArray();

  return new Response(JSON.stringify(addresses.map(a => ({ ...a, _id: a._id.toString() }))), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  // 🔥 check if user already has addresses
  const existingCount = await db.collection("addresses").countDocuments({
    user_id: session.user.id
  });

  const isFirstAddress = existingCount === 0;

  const result = await db.collection("addresses").insertOne({
    user_id: session.user.id,
    name: body.name,
    phone: body.phone,
    city: body.city,
    addressLine: body.addressLine,
    default: isFirstAddress, // 👈 KEY LOGIC
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const newAddress = await db.collection("addresses").findOne({
    _id: result.insertedId
  });

  return new Response(
    JSON.stringify({ ...newAddress, _id: newAddress._id.toString() }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export async function PUT(req) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const { _id, ...rest } = body;

  await db.collection("addresses").updateOne(
    { _id: new ObjectId(_id), user_id: session.user.id },
    { $set: { ...rest, updatedAt: new Date() } }
  );

  // ✅ RETURN UPDATED DOC
  const updated = await db.collection("addresses").findOne({
    _id: new ObjectId(_id),
  });

  return new Response(
    JSON.stringify({ ...updated, _id: updated._id.toString() }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function DELETE(req) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const id = body.id;

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const addressToDelete = await db.collection("addresses").findOne({
    _id: new ObjectId(id),
    user_id: session.user.id,
  });

  if (!addressToDelete) {
    return new Response(JSON.stringify({ error: "Address not found" }), {
      status: 404,
    });
  }

  // delete
  await db.collection("addresses").deleteOne({
    _id: new ObjectId(id),
    user_id: session.user.id,
  });

  // handle default reassignment
  if (addressToDelete.default) {
    const oldestAddress = await db
      .collection("addresses")
      .find({ user_id: session.user.id })
      .sort({ createdAt: 1 })
      .limit(1)
      .toArray();

    if (oldestAddress.length > 0) {
      await db.collection("addresses").updateOne(
        { _id: oldestAddress[0]._id },
        { $set: { default: true } }
      );
    }
  }

  // 🔥 return updated list
  const updatedAddresses = await db
    .collection("addresses")
    .find({ user_id: session.user.id })
    .toArray();

  console.log("updated addresses after delete: ", updatedAddresses);

  return new Response(
    JSON.stringify(
      updatedAddresses.map(a => ({
        ...a,
        _id: a._id.toString(),
      }))
    ),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}