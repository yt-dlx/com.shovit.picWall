#=======================================================================================================================================================================================
# Script 0: Create the Opposite Folder Structure
#=======================================================================================================================================================================================
import os
base_directory = "original"
cinematic_topics = [
    "Sunset", "Horizon", "Waves", "Reflection", "Journey", "Tranquil", "Wilderness", "Peace", 
    "Spirit", "Dream", "Mist", "Rain", "Morning", "Moonlight", "Sunrise", "Twilight", "Meadow", 
    "Ocean", "Sky", "Forest", "Romance", "Spring", "Autumn", "Snowfall", "Lullaby", "Cascade", 
    "Adventure", "Escape", "Serenade", "Cascade", "Starry", "Breeze", "Reflection", "Solitude", 
    "Eternal", "Hope", "Journey", "Pathway", "Illumination", "Mysteries", "Serenity", "Discovery", 
    "Tranquility", "Ripple", "Stars", "Whispers", "Love", "Dream", "Solitude", "Forest"
]
geometry_topics = [
    "Flow", "Circle", "Wave", "Line", "Curve", "Balance", "Shape", "Triangle", "Grid", "Reflection", 
    "Texture", "Path", "Horizon", "Radius", "Symmetry", "Spiral", "Vertex", "Angle", "Harmony", "Fractal", 
    "Growth", "Tiling", "Light", "Layers", "Balance", "Pathway", "Geometry", "Space", "Pattern", "Gridlock", 
    "Expansion", "Reflection", "Organic", "Expansion", "Intersection", "Hexagon", "Cube", "Mosaic", "Polyhedron", 
    "Crystals", "Prism", "Polygon", "Mirage", "Geometry", "Equilibrium", "Tiling", "Geodesic", "Waves", "Movement", "Structure"
]
anime_topics = [
    "Forest", "Sky", "Ocean", "Stars", "Spirit", "Journey", "Dream", "Peace", "Magic", "Rainbow", 
    "Mountain", "River", "Meadow", "Breeze", "Eclipse", "Snow", "Crystal", "Sunrise", "Thunder", "Horizon", 
    "Whispers", "Moon", "Autumn", "Spring", "Wilderness", "Bloom", "Hero", "Shimmer", "Elemental", "Tranquil", 
    "Element", "Firefly", "Ember", "Blossom", "Tranquility", "Wilderness", "Valley", "Horizon", "Breeze", 
    "Twilight", "Seasons", "Adventure", "Wonder", "Journey", "Magic", "Whispers", "Quest", "Dream", 
    "Celestial", "Fantasy", "Blossom", "Shimmer"
]
def create_folders(category_name, topics):
    category_path = os.path.join(base_directory, category_name)
    os.makedirs(category_path, exist_ok=True)
    for topic in topics:
        folder_path = os.path.join(category_path, topic)
        os.makedirs(folder_path, exist_ok=True)
        print(f"Folder created: {folder_path}")
create_folders("Anime", anime_topics)
create_folders("Cinematic", cinematic_topics)
create_folders("Geometry", geometry_topics)