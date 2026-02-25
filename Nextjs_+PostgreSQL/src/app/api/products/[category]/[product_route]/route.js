import { products } from "@/app/api/data";

export async function GET(req, context) {
  const { category, product_route } = await context.params;
  const product_data = products.find(item => item.category === category && item.name.toLowerCase().split(' ').join('-') === product_route) ?? null;
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