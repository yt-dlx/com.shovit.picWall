// src/utils/static.ts
type Category = {
  base: string;
  names: string[];
  subCategories: string[];
};
type ImageSet = string[];
const categories: Category[] = [
  {
    base: "Anime",
    subCategories: ["Abstract", "DuskLife", "Cyberpunk", "Ethereal"],
    names: ["Celestial Sky", "Sunset Prairie", "hacker Forest", "Fairy Pond"]
  },
  {
    base: "Cinematic",
    subCategories: ["Abstract", "DuskLife", "Cyberpunk", "Ethereal"],
    names: ["Galactic Flow", "Dusky Beach", "Techno Mountains", "Ethereal Peaks"]
  },
  {
    base: "Geometry",
    subCategories: ["Rain", "Snow", "Nature", "Synthwave"],
    names: ["Hexagon Haze", "Polygon Peaks", "Geometrix Forest", "Park Lights"]
  },
  {
    base: "Photography",
    subCategories: ["Aerial View", "Minimalism", "Landscapes", "NightLife"],
    names: ["Snowy Peaks", "Calm River", "Autumn Forest", "Glowing Path"]
  }
];
const generateImageUrls = (category: Category): ImageSet => {
  const urls: ImageSet = [];
  category.names.forEach((name, index) => {
    const subCategory = category.subCategories[index % category.subCategories.length];
    const randomIndex = (): number => Math.floor(Math.random() * 4) + 1;
    urls.push(`https://raw.githubusercontent.com/yt-dlx/picWall/${category.base}/${subCategory}/min/${name} (${randomIndex()}).jpg`);
  });
  return urls;
};
const imageSets: ImageSet[] = categories.map((category) => generateImageUrls(category));
export default imageSets;
