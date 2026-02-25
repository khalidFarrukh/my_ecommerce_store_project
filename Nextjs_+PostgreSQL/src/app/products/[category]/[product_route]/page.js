import ProductClient from "./ProductClient";


export default async function Page({ params }) {
  const { category, product_route } = await params;

  // 1️⃣ Fetch selected product
  const productRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${category}/${product_route}`,
    { cache: "no-store" }
  );

  if (!productRes.ok) {
    return <div>Product not found</div>;
  }

  const selectedProduct = await productRes.json();

  // 2️⃣ Fetch related products
  const relatedRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${selectedProduct.category}/related_products?offset=0&limit=4&exclude=${selectedProduct._id}`,
    { cache: "no-store" }
  );

  const relatedJson = await relatedRes.json();
  const relatedProducts = relatedJson.data;

  return (
    <ProductClient
      selectedProduct={selectedProduct}
      relatedProducts={relatedProducts}
    />
  );
}
