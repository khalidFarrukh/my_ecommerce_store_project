import ProductListingClient from "@/components/ProductListingClient";
import React from "react";

import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { collection_route } = await params;

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  const collection = await db.collection("collections").findOne({
    slug: collection_route,
  });

  if (!collection) {
    notFound(); // IMPORTANT
  }


  return (
    <ProductListingClient visible_path_name="collections" path_name="collections" route={collection_route} type="collection" />
  );
}