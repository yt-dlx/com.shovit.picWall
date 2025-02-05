// client/src/utils/sercon.ts
import Constants from "expo-constants";

export async function fetchAllData() {
  try {
    const version = Constants.expoConfig?.version;
    if (!version) throw new Error("Version information is missing from Constants.expoConfig");
    const baseUrl = __DEV__ ? "http://192.168.80.241:3000/api/database" : "https://picwall-server.netlify.app/api/database";
    const response = await fetch(baseUrl, { headers: { "x-app-version": version } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchAllData error:", error);
    throw error;
  }
}

export async function fetchCategoryData(category: string) {
  const baseUrl = __DEV__ ? `http://192.168.80.241:3000/api/database/${category}` : `https://picwall-server.netlify.app/api/database/${category}`;
  const version = Constants.expoConfig?.version;
  if (!version) throw new Error("Version information is missing from Constants.expoConfig");
  const response = await fetch(baseUrl, { headers: { "x-app-version": version } });
  const data = await response.json();
  return data;
}

export async function fetchSubcategoryData(category: string, subcategory: string) {
  const baseUrl = __DEV__ ? `http://192.168.80.241:3000/api/database/${category}/${subcategory}` : `https://picwall-server.netlify.app/api/database/${category}/${subcategory}`;
  const version = Constants.expoConfig?.version;
  if (!version) throw new Error("Version information is missing from Constants.expoConfig");
  const response = await fetch(baseUrl, { headers: { "x-app-version": version } });
  const data = await response.json();
  return data;
}
