const shippingConfig =
{
  perKgRate: 50,
  rules: {
    byPrice: [
      {
        minAmount: 0,
        maxAmount: 3000,
        fee: 250
      },
      {
        minAmount: 3001,
        maxAmount: 10000,
        fee: 150
      },
      {
        minAmount: 10001,
        fee: 0
      }
    ],
    byWeight: [
      {
        minAmount: 0,
        maxAmount: 3000,
        fee: 250
      },
      {
        minAmount: 3001,
        maxAmount: 10000,
        fee: 150
      },
      {
        minAmount: 10001,
        fee: 0
      }
    ]
  }
}