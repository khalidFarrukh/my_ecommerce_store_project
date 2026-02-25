export const collections = [
  {
    _id: "0",
    name: "Latest Products",
    description: "Newest arrivals in our store",
  },
  {
    _id: "1",
    name: "Weekly Picks",
    description: "Handpicked favorites this week",
    turnedoff: true,
  },
  {
    _id: "2",
    name: "Sale",
    description: "Discounted items for a limited time",
    turnedoff: true,
  },
  {
    _id: "3",
    name: "All Products",
    description: "everything you want",
  }
];

export let categories = [
  {
    name: "Audio",
    subcategories: []
  },
  {
    name: "Bag",
    subcategories: []
  },
  {
    name: "Furniture",
    subcategories: []
  },
  {
    name: "Home Appliances",
    subcategories: []
  },
  {
    name: "Fashion",
    subcategories: []
  },
  {
    name: "Accessories",
    subcategories: []
  },
]

export const products = [
  {
    _id: "0",
    name: "Audio Arrogance Aural Elite",
    description:
      "Immerse in audio with the Audio Arrogance AuralElite Bluetooth headphones.",
    variants: [
      {
        id: "1-black-anc",
        options: { color: "Black", "noise canceling": "ANC" },
        price: 249,
        discount: 20,
        stock: 120,
        default: true,
        images: [
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/headphones-nobg-1700675136219.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/headphones-nobg-1700675136219.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/headphones-nobg-1700675136219.png",
            alt: "something",
          }
        ]
      },
      {
        id: "1-black-none",
        options: { color: "Black", "noise canceling": "None" },
        price: 229,
        discount: 10,
        stock: 60,
        images: [
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/headphones-nobg-1700675136219.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/headphones-nobg-1700675136219.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/headphones-nobg-1700675136219.png",
            alt: "something",
          }
        ]
      },
      {
        id: "1-silver-anc",
        options: { color: "Silver", "noise canceling": "ANC" },
        price: 259,
        discount: 5,
        stock: 30,
        images: [
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/headphones-nobg-1700675136219.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/headphones-nobg-1700675136219.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/headphones-nobg-1700675136219.png",
            alt: "something",
          }
        ]
      }
    ],
    info: {
      material: "-",
      weight: 0.8,
      country_of_origin: "-",
      dimensions: "25x20x10",
      type: "-"
    },
    collectionIds: ["latest-products"],
    category: "audio"
  },

  {
    _id: "1",
    name: "Pinnacle Posh Pack",
    description: "Luxury leather backpack for modern adventurers.",
    variants: [
      {
        id: "posh-pack-black",
        options: { color: "Black" },
        price: 199,
        discount: 15,
        stock: 80,
        default: true,
        images: [
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/bag-nobg-1700675158493.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/bag-nobg-1700675158493.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/bag-nobg-1700675158493.png",
            alt: "something",
          },
        ]

      },
      {
        id: "posh-pack-white",
        options: { color: "White" },
        price: 199,
        discount: 5,
        stock: 40,
        images: [
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/bag-nobg-1700675158493.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/bag-nobg-1700675158493.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/bag-nobg-1700675158493.png",
            alt: "something",
          },
        ]
      }
    ],
    info: { material: "Leather", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    collectionIds: ["latest-products"],
    category: "bag"
  },

  {
    _id: "2",
    name: "Vinyl Virtuoso Opulenza",
    description: "Vintage-inspired analog turntable.",
    variants: [
      {
        id: "vinyl-eu",
        options: { plug: "EU" },
        price: 349,
        discount: 10,
        stock: 50,
        default: true,
        images: [
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/turntable-nobg-1700675179097.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/turntable-nobg-1700675179097.png",
            alt: "something",
          },
          {
            src: "https://medusa-server-testing.s3.us-east-1.amazonaws.com/turntable-nobg-1700675179097.png",
            alt: "something",
          },
        ]
      }
    ],
    info: {
      material: "Aluminium",
      weight: "80 g",
      country_of_origin: "DK",
      dimensions: "33L x 65W x 16H",
      type: "-"
    },
    collectionIds: ["latest-products"],
    category: "audio"
  },

  {
    _id: "3",
    name: "Nebula Noir Hoodie",
    description: "Cosmic-inspired premium hoodie.",
    variants: [
      {
        id: "hoodie-m",
        options: { size: "M" },
        price: 79,
        discount: 10,
        stock: 150,
        default: true,
        images: [
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/hoodie-nobg-1700675072425.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/hoodie-nobg-1700675072425.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/hoodie-nobg-1700675072425.png",
            alt: "something",
          },
        ]
      }
    ],
    info: { material: "-", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    collectionIds: ["weekly-picks"],
    category: "fashion"
  },

  {
    _id: "4",
    name: "Exorbita Elegence Elite",
    description: "Luxury watch with kinetic or battery power.",
    variants: [
      {
        id: "watch-leather-kinetic",
        options: { wristband: "Leather", power: "Kinetic" },
        price: 499,
        discount: 5,
        stock: 25,
        default: true,
        images: [
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/watch-nobg-1700675096621.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/watch-nobg-1700675096621.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/watch-nobg-1700675096621.png",
            alt: "something",
          },

        ]
      }
    ],
    info: { material: "-", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    collectionIds: ["weekly-picks"],
    category: "accessories"
  },

  {
    _id: "5",
    name: "BlendMaster Elite Fusionator",
    description: "High-end blender for culinary pros.",
    variants: [
      {
        id: "blend-eu",
        options: { plug: "EU" },
        price: 159,
        discount: 25,
        stock: 70,
        default: true,
        images: [
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/blender-nobg-1700674984144.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/blender-nobg-1700674984144.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/blender-nobg-1700674984144.png",
            alt: "something",
          },
        ]
      }
    ],
    info: { material: "-", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    collectionIds: ["sale"],
    category: "home-appliances"
  },

  {
    _id: "6",
    name: "Corporate Commando Throne",
    description: "Ergonomic office chair.",
    variants: [
      {
        id: "chair-height",
        options: { adjustability: "Height" },
        price: 299,
        discount: 10,
        stock: 40,
        default: true,
        images: [
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/chair-nobg-1700675020905.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/chair-nobg-1700675020905.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/chair-nobg-1700675020905.png",
            alt: "something",
          },
        ]
      }
    ],
    info: { material: "-", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    collectionIds: ["sale"],
    category: "furniture"
  },

  {
    _id: "7",
    name: "Decibel Dominator Deluxe",
    description: "Bluetooth DAB+ clock radio.",
    variants: [
      {
        id: "radio-black",
        options: { color: "Black" },
        price: 129,
        discount: 20,
        stock: 90,
        default: true,
        images: [
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/radio-nobg-1700675050588.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/radio-nobg-1700675050588.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/radio-nobg-1700675050588.png",
            alt: "something",
          },
        ]
      },
      {
        id: "radio-yellow",
        options: { color: "Yellow" },
        price: 129,
        discount: 5,
        stock: 30,
        images: [
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/radio-nobg-1700675050588.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/radio-nobg-1700675050588.png",
            alt: "something",
          },
          {
            src:
              "https://medusa-server-testing.s3.us-east-1.amazonaws.com/radio-nobg-1700675050588.png",
            alt: "something",
          },
        ]
      }
    ],
    info: { material: "-", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    collectionIds: ["sale"],
    category: "audio"
  }
];
