import ProductListingClient from "@/components/ProductListingClient";
import React from "react";

export default async function Page({ params }) {
  const { category } = await params;
  return (
    <ProductListingClient visible_path_name="products" path_name="collections" route={category} type="category" />
  );

}