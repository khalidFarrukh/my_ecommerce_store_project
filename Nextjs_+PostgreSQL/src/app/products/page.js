import React from "react";
import ProductListingClient from "../../components/ProductListingClient";
import { getCategories } from "@/utils/utilities";

export default async function Page() {
  return (
    <ProductListingClient data={[]} visible_path_name="products" path_name="collections" route={"search-route"} type="search" />
  );
}