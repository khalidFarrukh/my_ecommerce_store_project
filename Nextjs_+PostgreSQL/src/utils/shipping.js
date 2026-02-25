export const PUBLIC_SHIPPING_RATES = [
  { maxWeight: 0, price: 0 },
  { maxWeight: 0.5, price: 140 },
  { maxWeight: 1, price: 170 },
  { maxWeight: 2, price: 230 },
  { maxWeight: 3, price: 300 },
  { maxWeight: 5, price: 400 },
  { maxWeight: 10, price: 600 },
];

export function getShippingPrice(weight) {
  const slab = PUBLIC_SHIPPING_RATES.find(r => weight <= r.maxWeight);
  return slab ? slab.price : 800;
}