import { products } from "../../data"

export async function GET(req, context) {
  const { category, product } = await context.params;
  const product_data = products.filter(item => item.category === category && item.name === product) ?? null;

  if (!product_data) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(product_data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}