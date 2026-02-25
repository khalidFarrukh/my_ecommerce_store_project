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

export default {
  getCollections,
  getCategories,
  convertDashStringToTextString,
  convertTextStringToDashString
};