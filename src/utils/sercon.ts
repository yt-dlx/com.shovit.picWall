// src/utils/sercon.ts
const BASE_URL = __DEV__ ? "http://192.168.23.98:3000" : "https://picwall-server.netlify.app";
export async function fetchAllData() {
  try {
    const response = await fetch(`${BASE_URL}/api/database`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchAllData error:", error);
    throw error;
  }
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
