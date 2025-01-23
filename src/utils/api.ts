// src/utils/api.ts
const BASE_URL = __DEV__ ? "http://192.168.224.173:3000" : "https://pic-wall.vercel.app";
export async function fetchAllData() {
  const response = await fetch(`${BASE_URL}/api/database`);
  const data = await response.json();
  return data;
}
export async function fetchCategoryData(category: string) {
  const response = await fetch(`${BASE_URL}/api/database/${category}`);
  const data = await response.json();
  return data;
}
export async function fetchSubcategoryData(category: string, subcategory: string) {
  const response = await fetch(`${BASE_URL}/api/database/${category}/${subcategory}`);
  const data = await response.json();
  return data;
}
