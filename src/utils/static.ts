// src/utils/static.ts
type Category = {
  base: string;
  names: string[];
  subCategories: string[];
};
type ImageSet = string[];
const categories: Category[] = [
  {
    base: "Abstract",
    subCategories: ["Anime", "Cinematic", "Geometry", "Realism"],
    names: ["Bubble Hearts", "Chromatic Storm", "Circuit Maze", "Crystal Burst"]
  },
  {
    base: "Landscapes",
    subCategories: ["Anime", "Cinematic", "Geometry", "Realism"],
    names: ["Blossom Arch", "Cloudy Cliffs", "Circuit Plains", "Autumn Bridge"]
  },
  {
    base: "Minimalist",
    subCategories: ["Anime", "Cinematic", "Geometry", "Realism"],
    names: ["Blush Grid", "Falling Shapes", "Contour Wave", "Chrome Ring"]
  },
  {
    base: "Urban",
    subCategories: ["Anime", "Cinematic", "Geometry", "Realism"],
    names: ["Canal Row", "Desert Town", "Checker Avenue", "Abandoned Block"]
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
