import { products } from "../../data";

export async function GET(request, context) {
  const { category } = await context.params;

  const filteredProducts = products.filter(
    (item) => item.category === category
  );

  return new Response(JSON.stringify(filteredProducts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
