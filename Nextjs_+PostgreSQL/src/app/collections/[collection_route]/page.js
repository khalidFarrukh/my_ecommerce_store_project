import React from "react";
import { getCollections } from "@/utils/utilities";
import ProductListingClient from "../../../components/ProductListingClient";

export default async function Page({ params }) {
  const { collection_route } = await params;
  let collections = await getCollections();


  return (
    <ProductListingClient data={collections} visible_path_name="collections" path_name="collections" route={collection_route} type="collection" />
  );
}