export async function getCollections() {
  const res = await fetch("http://localhost:3000/api/collections", {
    cache: "no-store"
  });

  if (!res.ok) return [];

  return res.json();
}

export async function getCategories() {
  const res = await fetch("http://localhost:3000/api/categories", {
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
export function convertTextStringToDashString(slug) {
  return slug
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

export default {
  getCollections,
  getCategories,
  convertDashStringToTextString,
  convertTextStringToDashString,
  objectThatOnlyContainsProperties_to_arrayOfObjectsWithEachObjContainingItsIdAndProperty,
  arrayOfObjectsWithEachObjContainingItsIdAndProperty_to_objectThatOnlyContainsProperties,
  capitalizeEachFirstCharOfWord
};