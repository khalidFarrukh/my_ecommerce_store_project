export const collections = [
  {
    id: "latest-products",
    name: "Latest Products",
    route: "/collections/latest-products",
    description: "Newest arrivals in our store"
  },
  {
    id: "weekly-picks",
    name: "Weekly Picks",
    route: "/collections/weekly-picks",
    description: "Handpicked favorites this week"
  },
  {
    id: "sale",
    name: "Sale",
    route: "/collections/sale",
    description: "Discounted items for a limited time"
  },
  {
    id: "all-products",
    name: "All Products",
    route: "/collections/all-products",
    description: "everything you want"
  }
]

export const products = [
  {
    id: 0,
    collection_name: "Latest Products",
    name: "Audio Arrogance Aural Elite",
    thumbLink:
      "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fheadphones-nobg-1700675136219.png&w=828&q=50",
    description:
      "Immerse in audio with the Audio Arrogance AuralElite Bluetooth headphones.",
    variants: [
      {
        id: "1-black-anc",
        options: {
          "color": "Black",
          "noise canceling": "ANC"
        },
        price: 249,
        discount: 20,
        stock: 120,
        default: true
      },
      {
        id: "1-black-none",
        options: {
          "color": "Black",
          "noise canceling": "None"
        },
        price: 229,
        discount: 10,
        stock: 60
      },
      {
        id: "1-silver-anc",
        options: {
          "color": "Silver",
          "noise canceling": "ANC"
        },
        price: 259,
        discount: 5,
        stock: 30
      }
    ],
    info: { material: "-", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    route: "bluetooth-headphones",
    collection_id: "latest-products",
    category: "audio"
  },

  {
    id: 1,
    collection_name: "Latest Products",
    name: "Pinnacle Posh Pack",
    thumbLink:
      "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fbag-nobg-1700675158493.png&w=828&q=50",
    description: "Luxury leather backpack for modern adventurers.",
    variants: [
      {
        id: "posh-pack-black",
        options: {
          "color": "Black"
        },
        price: 199,
        discount: 15,
        stock: 80,
        default: true
      },
      {
        id: "posh-pack-white",
        options: {
          "color": "White"
        },
        price: 199,
        discount: 5,
        stock: 40
      }
    ],
    info: { material: "Leather", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    route: "leather-backpack",
    collection_id: "latest-products",
    category: "bag"
  },

  {
    id: 2,
    collection_name: "Latest Products",
    name: "Vinyl Virtuoso Opulenza",
    thumbLink:
      "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fturntable-nobg-1700675179097.png&w=828&q=50",
    description: "Vintage-inspired analog turntable.",
    variants: [
      {
        id: "vinyl-eu",
        options: {
          "plug": "EU"
        },
        price: 349,
        discount: 10,
        stock: 50,
        default: true
      },
      {
        id: "vinyl-us",
        options: {
          "plug": "US"
        },
        price: 349,
        discount: 0,
        stock: 30
      }
    ],
    info: {
      material: "Aluminium",
      weight: "80 g",
      country_of_origin: "DK",
      dimensions: "33L x 65W x 16H",
      type: "-"
    },
    route: "analog-turntable",
    collection_id: "latest-products",
    category: "audio"
  },

  {
    id: 3,
    collection_name: "Weekly Picks",
    name: "Nebula Noir Hoodie",
    thumbLink:
      "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fhoodie-nobg-1700675072425.png&w=828&q=50",
    description: "Cosmic-inspired premium hoodie.",
    variants: [
      {
        id: "hoodie-m",
        options: {
          "size": "M"
        },
        price: 79,
        discount: 10,
        stock: 150,
        default: true
      }
    ],
    info: { material: "-", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    route: "nebula-noir-hoodie",
    collection_id: "weekly-picks",
    category: "fashion"
  },

  {
    id: 4,
    collection_name: "Weekly Picks",
    name: "Exorbita Elegence Elite",
    thumbLink:
      "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fwatch-nobg-1700675096621.png&w=828&q=50",
    description: "Luxury watch with kinetic or battery power.",
    variants: [
      {
        id: "watch-leather-kinetic",
        options: {
          "wristband": "Leather",
          "power": "Kinetic"
        },
        price: 499,
        discount: 5,
        stock: 25,
        default: true
      }
    ],
    info: { material: "-", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    route: "exorbita-elegence-elite",
    collection_id: "weekly-picks",
    category: "accessories"
  },

  {
    id: 5,
    collection_name: "Sale",
    name: "BlendMaster Elite Fusionator",
    thumbLink:
      "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fblender-nobg-1700674984144.png&w=828&q=50",
    description: "High-end blender for culinary pros.",
    variants: [
      {
        id: "blend-eu",
        options: {
          "plug": "EU"
        },
        price: 159,
        discount: 25,
        stock: 70,
        default: true
      }
    ],
    info: { material: "-", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    route: "blend-master-elite-fusionator",
    collection_id: "sale",
    category: "home-appliances"
  },

  {
    id: 6,
    collection_name: "Sale",
    name: "Corporate Commando Throne",
    thumbLink:
      "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fchair-nobg-1700675020905.png&w=828&q=50",
    description: "Ergonomic office chair.",
    variants: [
      {
        id: "chair-height",
        options: {
          "adjustability": "Height"
        },
        price: 299,
        discount: 10,
        stock: 40,
        default: true
      }
    ],
    info: { material: "-", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    route: "corporate-commando-throne",
    collection_id: "sale",
    category: "furniture"
  },

  {
    id: 7,
    collection_name: "Sale",
    name: "Decibel Dominator Deluxe",
    thumbLink:
      "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fradio-nobg-1700675050588.png&w=828&q=75",
    description: "Bluetooth DAB+ clock radio.",
    variants: [
      {
        id: "radio-black",
        options: {
          "color": "Black"
        },
        price: 129,
        discount: 20,
        stock: 90,
        default: true
      },
      {
        id: "radio-yellow",
        options: {
          "color": "Yellow"
        },
        price: 129,
        discount: 5,
        stock: 30
      }
    ],
    info: { material: "-", weight: "-", country_of_origin: "-", dimensions: "-", type: "-" },
    route: "decibel-dominator-deluxe",
    collection_id: "sale",
    category: "audio"
  }
];

