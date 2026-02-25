import { products } from "../data";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase().trim() || "";

  if (!q) {
    return Response.json([]);
  }

  const filtered = products.filter((product) => {
    const nameMatch = product.name?.toLowerCase().includes(q);
    const descriptionMatch = product.description
      ?.toLowerCase()
      .includes(q);
    const categoryMatch = product.category
      ?.toLowerCase()
      .includes(q);

    const variantsMatch = product.variants?.some((variant) => {
      const options = variant.options || {};

      return Object.entries(options).some(([key, value]) => {
        const keyStr = String(key).toLowerCase();
        const valStr = String(value).toLowerCase();
        return keyStr.includes(q) || valStr.includes(q);
      });
    });

    return nameMatch || descriptionMatch || categoryMatch || variantsMatch;
  });

  return Response.json(filtered);
}