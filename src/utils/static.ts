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
    subCategories: ["Rain", "Snow", "Urban", "Synthwave"],
    names: ["Rainy Forest", "Snowy Forest", "City Park", "Neon Dunes"]
  },
  {
    base: "Cinematic",
    subCategories: ["Rain", "Snow", "Urban", "Synthwave"],
    names: ["Rainy Forest", "Snowy Forest", "City Park", "Neon Dunes"]
  },
  {
    base: "Geometry",
    subCategories: ["Rain", "Snow", "Urban", "Synthwave"],
    names: ["Geometric Raindrops", "Hexagonal Snowflakes", "Geometric Park", "Neon Geometry"]
  },
  {
    base: "Photography",
    subCategories: ["Rain", "Snow", "Urban", "Synthwave"],
    names: ["Rainy Forest", "Snowy Forest", "City Park", "Neon Dunes"]
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
