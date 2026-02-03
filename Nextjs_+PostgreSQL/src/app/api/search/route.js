import { products } from "../data"

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  const filtered = products.filter(product =>
    product.pname.toLowerCase().includes(q)
  );

  return Response.json(filtered);
}