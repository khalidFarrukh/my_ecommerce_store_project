import { buildOptionsFromVariantsByUnion } from "./src/utils/buildOptionsFromVariantsByUnion.js";

const safeData = {
  _id: "69b2ebb4eb5cf554dfb3b038",
  name: "Audio Arrogance Aural Elite",
  variants: [
    {
      options: [
        {
          "id": "e522d12d-6ddd-4b78-af50-0a7d68288f6d",
          "name": "color",
          "value": "Black"
        },
        {
          "id": "0b927f11-b7b0-4124-a781-b290e362969f",
          "name": "noise canceling",
          "value": "ANC"
        },
        {
          "id": "752c01ef-805d-4879-ab32-b815b7bdbfc5",
          "name": "material",
          "value": "plastic"
        }
      ]
    },
    {
      sku: "",
      options: [
        {
          "id": "4eae5cfb-6efc-4eeb-9789-65f4e66b9847",
          "name": "color",
          "value": "Black"
        },

      ]
    },
    {
      sku: "",
      options: [

        {
          "id": "3e6615a3-0e59-4798-9b45-058a410b5833",
          "name": "noise canceling",
          "value": "ANC"
        }
      ]
    }
  ]
}

const createShortFormString = (str) => {
  const wordArr = String(str).split(" ");
  let shortForm = [];
  wordArr.map(word => shortForm.push(word[0]))

  return shortForm.join('');
}

const normalizeSkuPart = (value) =>
  String(value)
    .trim()
    .replaceAll(" ", "_")
    .toUpperCase();

const productBaseCode = createShortFormString(safeData.name);
if (safeData.variants.length > 0) {
  const availableOptions = buildOptionsFromVariantsByUnion(safeData.variants);

  // STEP 1 → normalize all variants
  Object.entries(availableOptions).forEach(([label]) => {
    safeData.variants.forEach(variant => {
      if (variant.options.every(option => option.name !== label)) {
        variant.options.push({
          id: crypto.randomUUID(),
          name: label,
          value: "-",
        });
      }
    });
  });

  // STEP 2 → generate SKU only after normalization
  safeData.variants.forEach(variant => {
    variant.sku ??= "";

    if (variant?.sku !== "") return;

    const hasMissingOption = variant.options.some(
      option => option.value === "-"
    );

    if (!hasMissingOption) {
      variant.sku = [
        String(safeData._id).slice(-4),
        productBaseCode,
        ...variant.options.map(option => normalizeSkuPart(option.value))
      ].join("-");
    }
  });
}

safeData.variants.map(variant => {

  console.log(variant);
})
