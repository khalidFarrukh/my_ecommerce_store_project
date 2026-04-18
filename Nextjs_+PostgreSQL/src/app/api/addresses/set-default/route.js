import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Session expired" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const id = body.id;

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  // 🔥 Step 1: find current default address
  const currentDefault = await db.collection("addresses").findOne({
    user_id: session.user.id,
    default: true,
  });

  console.log("current default address: ", currentDefault);

  // 🔥 Step 2: unset only that one (if exists)
  if (currentDefault) {
    await db.collection("addresses").updateOne(
      { _id: currentDefault._id },
      { $set: { default: false } }
    );
  }

  // 🔥 Step 3: set new default
  await db.collection("addresses").updateOne(
    { _id: new ObjectId(id), user_id: session.user.id },
    { $set: { default: true } }
  );

  // 🔥 return updated list
  const updatedAddresses = await db
    .collection("addresses")
    .find({ user_id: session.user.id })
    .toArray();

  console.log(updatedAddresses);

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