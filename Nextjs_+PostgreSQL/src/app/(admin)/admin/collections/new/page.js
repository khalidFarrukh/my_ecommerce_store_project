import { redirect } from "next/navigation";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export default async function NewCollectionPage() {
  // const session = await auth();
  // if (!session) {
  //   redirect("/signIn?callbackUrl=/admin");
  // }

  // if (session.user.role !== "ADMIN") {
  //   redirect("/");
  // }

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const last = await db
    .collection("collections")
    .find({})
    .sort({ orderNo: -1 })
    .limit(1)
    .toArray();

  const nextOrder = last.length ? last[0].orderNo + 1 : 1;

  const result = await db.collection("collections").insertOne({
    name: "New Collection",
    slug: `new-collection`,
    turnedoff: false,
    orderNo: nextOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  redirect(`/admin/collections/${result.insertedId}/edit`);
}