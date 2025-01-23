import os
from pathlib import Path
root_dir = Path.cwd()
folder_structure = {
    "Watercolor": [
        "Abstract Expressionist",
        "Abstract",
        "Botanical",
        "Brushstroke",
        "Floral",
        "Geometric",
        "Ink Blot",
        "Landscape",
        "Marbled",
        "Minimalist",
        "Ombre",
        "Pastel",
        "Splatter",
        "Textured",
        "Tropical",
        "Vintage",
        "Animal Patterns",
        "Gradients",
        "Typography",
        "Wash"
    ],
    "Oil Paint": [
        "Abstract",
        "Baroque",
        "Classic",
        "Expressionist",
        "Figurative",
        "Geometric",
        "Impressionist",
        "Landscape",
        "Modern",
        "Nature-Inspired",
        "Metallic",
        "Minimalist",
        "Murals",
        "Patterned",
        "Portrait",
        "Realistic",
        "Rustic",
        "Texture-Rich",
        "Vintage"
    ],
    "Origami": [
        "3D Effects",
        "Abstract Patterns",
        "Color-Blocked",
        "Cultural Motifs",
        "Decorative Borders",
        "Floral Motifs",
        "Geometric Patterns",
        "Mixed Media Designs",
        "Modular Designs",
        "Minimalist Designs",
        "Nature-Inspired",
        "Modern Styles",
        "Inspired Borders",
        "Minimalist Patterns",
        "Paper Texture",
        "Tessellations",
        "Pop-Up Styles",
        "Repeating Patterns",
        "Symmetrical Designs",
        "Traditional Patterns"
    ],
    "Acrylic": [
        "Abstract",
        "Bold Color",
        "Brushstroke",
        "Color Block",
        "Expressionist Patterns",
        "Fluid Art Patterns",
        "Floral Patterns",
        "Geometric",
        "Gradient Wallpapers",
        "Metallic Finishes",
        "Minimalist Designs",
        "Modern Art",
        "Mixed Media",
        "Ombre Wallpapers",
        "Pastel Colors",
        "Patterned Wallpapers",
        "Pop Art Designs",
        "Stencil Designs",
        "Textured"
    ],
    "Clay": [
        "Ceramic-Inspired Designs",
        "Art-Inspired Wallpapers",
        "Mosaic Wallpapers",
        "Sculpture Patterns",
        "Tile Patterns",
        "Texture Wallpapers",
        "Color-Toned Designs",
        "Decorative Borders",
        "Figurative Patterns",
        "Geometric Designs",
        "Hand-Built Textures",
        "Impressionist Designs",
        "Minimalist Wallpapers",
        "Organic Forms",
        "Rustic Patterns",
        "Rustic Textures",
        "Stained-Glass Patterns",
        "Terracotta Patterns"
    ],
    "Paper Craft": [
        "Origami-Inspired Layers",
        "Paper Cut Silhouettes",
        "Quilled Designs",
        "Papercut Geometrics",
        "Layered Paper Blossoms",
        "Paper Mosaic",
        "3D Paper Elements",
        "Hand-Painted Paper",
        "Paper Lace Patterns",
        "Pop-Up Paper Art",
        "Paper Strips Weave",
        "Stencil Paper Patterns",
        "Vintage Paper Collage",
        "Papier-Mâché Textures",
        "Paper Doodle Art",
        "Layered Paper Shadows",
        "Papercraft Animals",
        "Cut-Paper Florals",
        "Paper Twine Patterns",
        "Textured Paper Grains"
    ],
    "Flat": [
        "Minimalism",
        "Geometrics",
        "Botanical",
        "Abstract",
        "Typography",
        "Icons",
        "Stripes",
        "Polka Dots",
        "Waves",
        "Chevron",
        "Florals",
        "Paisley",
        "Herringbone",
        "Tiles",
        "Doodles",
        "Ombre",
        "Animal Prints",
        "Hexagons",
        "Waves and Dots",
        "Scandinavian"
    ]
}
def create_folders(root, structure):
    for main_folder, subfolders in structure.items():
        main_path = root / main_folder
        try:
            main_path.mkdir(parents=True, exist_ok=True)
            print(f"Created main folder: {main_path}")
        except Exception as e:
            print(f"Error creating main folder {main_path}: {e}")
            continue
        for subfolder in subfolders:
            sub_path = main_path / subfolder
            try:
                sub_path.mkdir(parents=True, exist_ok=True)
                print(f"  Created subfolder: {sub_path}")
            except Exception as e:
                print(f"  Error creating subfolder {sub_path}: {e}")
if __name__ == "__main__":
    create_folders(root_dir, folder_structure)
    print("Folder creation process completed.")