import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";
import { getAllCollections, getCategories } from "@/utils/utilities";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EditProductClient from "./EditProductClient";

export default async function EditProductPage({ params }) {
  const { product_id } = await params;
  const categories = await getCategories();
  let collections = await getAllCollections();



  collections = collections.sort((a, b) => {
    return a._id.localeCompare(b._id);
  });

  const filteredCollections = collections.filter((collection) => collection?.type === "manual");


  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const product = await db.collection("products").findOne({
    _id: new ObjectId(product_id),
  });

  const formattedProduct = {
    ...product,
    _id: product._id.toString(),
  };


  return (
    <div className="space-y-6">
      <AdminTabContentHeader
        heading="Edit Product"
        description="Edit your product"
      />

      <EditProductClient
        // session={session}
        product={formattedProduct}
        categories={categories}
        allCollections={filteredCollections}
      />
    </div>
  );
}