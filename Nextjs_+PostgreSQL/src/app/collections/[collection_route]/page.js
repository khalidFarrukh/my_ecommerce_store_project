import React from "react";
import ProductListingClient from "../../../components/ProductListingClient";

export default async function Page({ params }) {
  const { collection_route } = await params;

  return (
    <ProductListingClient visible_path_name="collections" path_name="collections" route={collection_route} type="collection" />
  );
}