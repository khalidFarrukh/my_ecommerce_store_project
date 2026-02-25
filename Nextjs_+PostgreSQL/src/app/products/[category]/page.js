import React from "react";
import ProductListingClient from "../../../components/ProductListingClient";
import { getCategories } from "@/utils/utilities";

export default async function Page({ params }) {
  const { category } = await params;
  const categories = await getCategories();
  return (
    <ProductListingClient data={categories} visible_path_name="products" path_name="collections" route={category} type="category" />
  );

}