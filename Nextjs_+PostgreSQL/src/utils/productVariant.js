export function getDefaultVariant(product) {
  const variants = product?.variants ?? [];

  if (variants.length === 0) return null;

  return (
    variants.find(v => v.default === true) ??
    variants[0]
  );
}

export function getVariantPricing(product) {
  const variant = getDefaultVariant(product);

  const price = variant?.price ?? 0;
  const discount = variant?.discount ?? 0;

  const finalPrice = Math.floor((price / 100) * (100 - discount));

  return {
    variant,
    price,
    discount,
    finalPrice,
  };
}
