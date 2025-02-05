// client/src/utils/static.ts
type Category = {
  base: string;
  names: string[];
  subCategories: string[];
};
type ImageSet = string[];
const categories: Category[] = [
  {
    base: "Anime",
    subCategories: ["Rain", "Retro", "Season", "Synthwave"],
    names: ["Rainfall Stream", "Arcade Glow", "Autumn Leaves", "Beach Vibes"]
  },
  {
    base: "Cinematic",
    subCategories: ["Abstract", "Nature", "Cyberpunk", "Ethereal"],
    names: ["Cosmic Forms", "Autumn Warmth", "Cyber Canopy", "Aurora Grove"]
  },
  {
    base: "Geometry",
    subCategories: ["Rain", "Snow", "Nature", "Synthwave"],
    names: ["Angular Arches", "Circular Snowdrifts", "Cactus Shapes", "Beach Glow"]
  },
  {
    base: "Photography",
    subCategories: ["Cyberpunk", "Minimalism", "Retro", "Synthwave"],
    names: ["City Lights", "Clear Horizon", "Classic Drivein", "Cyber Sunset"]
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
