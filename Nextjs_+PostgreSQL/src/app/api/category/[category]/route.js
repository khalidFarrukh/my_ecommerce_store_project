import { products } from "../../data"

export async function GET(req, context) {
  const { category } = await context.params;
  const products_data = products.filter(item => item.category === category);

  if (!products_data) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(products_data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}