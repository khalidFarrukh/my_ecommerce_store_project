import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";

export default async function NewProductPage() {
  // const session = await auth();

  // if (!session) {
  //   redirect("/signIn?callbackUrl=/admin");
  // }

  // if (session.user.role !== "ADMIN") {
  //   redirect("/");
  // }

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const result = await db.collection("products").insertOne({
    name: "",
    description: "",
    variants: [],
    info: {
      material: "",
      weight: "",
      country_of_origin: "",
      dimensions: "",
      type: ""
    },
    collectionIds: [],
    category: "",
    status: "draft",
    sellerId: "default_seller",
    createdAt: new Date(),
    updatedAt: new Date(),
  },);

  redirect(`/admin/products/${result.insertedId}/edit`);
}