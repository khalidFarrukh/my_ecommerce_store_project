export function getDefaultVariant(product) {
  const variants = product?.variants ?? [];

  if (variants.length === 0) return null;

  return (
    variants.find(v => v.default === true) ??
    variants[0]
  );
}


export function getVariantPricing(variant) {

  const price = variant?.price ?? 0;
  const discount = variant?.discount ?? 0;

  const finalPrice = Math.ceil(price - (price * discount) / 100);

  return {
    variant,
    price,
    discount,
    finalPrice,
  };
}


export function getDefaultVariantPricing(product) {
  const variant = getDefaultVariant(product);
  return getVariantPricing(variant);
}
