import { products } from "../../data"

export async function GET(req, context) {
  const { collection_id } = await context.params;
  const url = new URL(req.url);

  // Get query params
  const offset = parseInt(url.searchParams.get("offset") || "0"); // default 0
  const limit = parseInt(url.searchParams.get("limit") || "10"); // default 10 per request
  let products_data = [];
  if (collection_id === "all-products") {
    products_data = [...products];
  } else {
    products_data = products.filter(item => item.collection_id === collection_id);
  }
  //const product = products.find((item) => item.route === slug);


  if (!products_data) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
    });
  }

  // Slice the array for "load more"
  const nextProducts = products_data.slice(offset, offset + limit);

  const response = {
    total: products_data.length,
    offset,
    limit,
    data: nextProducts,
    hasMore: offset + limit < products_data.length, // frontend can use this to know if more exists
  };

  return new Response(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}