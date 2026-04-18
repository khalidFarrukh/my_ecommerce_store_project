import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";
import EditProductForm from "@/components/admin/products/EditProductForm";
import { getAllCollections, getCategories } from "@/utils/utilities";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function EditProductPage({ params }) {
  const session = await auth();

  if (!session || session.user.role === "USER") {
    redirect("/");
  }
  const { product_id } = await params;
  const categories = await getCategories();
  let collections = await getAllCollections();

  collections = collections.sort((a, b) => {
    return a._id.localeCompare(b._id);
  });
  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const product = await db.collection("products").findOne({
    _id: new ObjectId(product_id),
  });

  const formattedProduct = {
    ...product,
    _id: product._id.toString(),
  };

  console.log("formattedProduct -> ", formattedProduct);

  return (
    <div className="space-y-6">
      <AdminTabContentHeader
        heading="Edit Product"
        description="Edit your product"
      />

      <EditProductForm
        session={session}
        product={formattedProduct}
        categories={categories}
        allCollections={collections}
      />
    </div>
  );
}