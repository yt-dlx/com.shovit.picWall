// client/src/utils/sercon.ts
import Constants from "expo-constants";

export async function fetchAllData() {
  try {
    const version = Constants.manifest.version;
    const response = await fetch("https://picwall-server.netlify.app/api/database", { headers: { "x-app-version": version } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchAllData error:", error);
    throw error;
  }
}

export async function fetchCategoryData(category: string) {
  const response = await fetch(`https://picwall-server.netlify.app/api/database/${category}`);
  const data = await response.json();
  return data;
}

export async function fetchSubcategoryData(category: string, subcategory: string) {
  const response = await fetch(`https://picwall-server.netlify.app/api/database/${category}/${subcategory}`);
  const data = await response.json();
  return data;
}
