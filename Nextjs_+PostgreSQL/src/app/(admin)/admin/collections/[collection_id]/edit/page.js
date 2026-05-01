import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import EditCollectionClient from "./EditCollectionClient";

export default async function EditCollectionPage({ params }) {
  // const session = await auth();
  // if (!session) {
  //   redirect("/signIn?callbackUrl=/admin");
  // }

  // if (session.user.role !== "ADMIN") {
  //   redirect("/");
  // }

  const { collection_id } = await params;
  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const collection = await db.collection("collections").findOne({
    _id: new ObjectId(collection_id),
  });

  if (!collection) {
    redirect("/admin/collections");
  }

  const formatted = {
    ...collection,
    _id: collection._id.toString(),
  };

  return <EditCollectionClient collection={formatted} />;
}