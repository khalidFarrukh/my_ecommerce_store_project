import React from "react";
import ProductListingClient from "../../../components/ProductListingClient";

export default async function Page({ params }) {
  const { category } = await params;
  return (
    <ProductListingClient visible_path_name="products" path_name="collections" route={category} type="category" />
  );

}