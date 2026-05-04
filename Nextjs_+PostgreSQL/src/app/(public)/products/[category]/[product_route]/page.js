import NotFound from "@/components/NotFound";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { category, product_route } = await params;

  // 1️⃣ Fetch selected product
  const productRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${category}/${product_route}`,
    // { cache: "no-store" }
  );

  if (!productRes.ok) {
    notFound(); // IMPORTANT
  }

  const selectedProduct = await productRes.json();

  // 2️⃣ Fetch related products
  let relatedProducts = [];
  if (selectedProduct?._id !== null) {
    const relatedRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${selectedProduct.category}/related_products?offset=0&limit=4&exclude=${selectedProduct._id}`,
      // { cache: "no-store" }
    );

    const relatedJson = await relatedRes.json();
    relatedProducts = relatedJson.data;
  }


  return (
    <ProductClient
      key={selectedProduct?._id}
      selectedProduct={selectedProduct}
      relatedProducts={relatedProducts}
    />
  );
}
