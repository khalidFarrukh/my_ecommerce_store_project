

export async function getAllCollections() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collections`, {
    cache: "no-store"
  });

  if (!res.ok) return [];

  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
    cache: "no-store"
  });

  if (!res.ok) return [];

  return res.json();
}

export function convertDashStringToTextString(slug) {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export function convertTextStringToDashString(text) {
  return text
    .toLowerCase()
    .split(" ")
    .join("-");
}

export function objectThatOnlyContainsProperties_to_arrayOfObjectsWithEachObjContainingItsIdAndProperty(obj) {
  return Object.entries(obj).map(([key, value], index) => ({
    id: index,
    [key]: value
  }));
}
export function arrayOfObjectsWithEachObjContainingItsIdAndProperty_to_objectThatOnlyContainsProperties(arr) {
  const result = {};

  arr.forEach((item) => {
    const key = Object.keys(item).find((k) => k !== "id");
    result[key] = item[key];
  });

  return result;
}

export function capitalizeEachFirstCharOfWord(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getAdminProductIssues(product) {
  const issues = [];

  if (!product.name) issues.push("Missing name");

  if (!product.category) issues.push("Missing category");

  if (product.variants.length === 0) {
    issues.push("No variants");
    return issues;
  }

  const missingPrice = product.variants.some(v => !v.price);
  if (missingPrice) issues.push("Missing price");

  const missingImages = product.variants.some(v => v.images.length === 0);
  if (missingImages) issues.push("Missing images");

  return issues;
}

export function parseWeight(weightStr) {
  if (!weightStr) return 0;

  const value = parseFloat(weightStr); // extracts number
  if (isNaN(value)) return 0;

  if (weightStr.toLowerCase().includes("kg")) {
    return value;
  }

  if (weightStr.toLowerCase().includes("g")) {
    return value / 1000;
  }


  return value; // fallback
}

export function parseDimensions(dimStr) {
  if (!dimStr) return [0, 0, 0];

  const parts = dimStr.split("x").map(n => Number(n));

  if (parts.length !== 3 || parts.some(isNaN)) {
    return [0, 0, 0];
  }

  return parts;
}

export const handleTextareInput = (ref) => {
  const textarea = ref.current;
  if (!textarea) return;

  textarea.style.height = "auto"; // reset
  textarea.style.height = textarea.scrollHeight + "px"; // grow to content
};


export default {
  getAllCollections,
  getCategories,
  convertDashStringToTextString,
  convertTextStringToDashString,
  objectThatOnlyContainsProperties_to_arrayOfObjectsWithEachObjContainingItsIdAndProperty,
  arrayOfObjectsWithEachObjContainingItsIdAndProperty_to_objectThatOnlyContainsProperties,
  capitalizeEachFirstCharOfWord,
  getAdminProductIssues,
  parseWeight,
  parseDimensions,
  handleTextareInput
};