#=======================================================================================================================================================================================
# Script 0: Create the Original Folders
#=======================================================================================================================================================================================
import os
categories = {
    "Surreal": {
        "Anime": ["Flat", "Background", "Illustration", "Semi Realism", "Retro"],
        "Cinematic": ["Moody", "Cinematic", "Bokeh", "Minimalist", "Unprocessed"],
        "Geometry": ["2d", "3d", "Minimalist"],
        "Realism": ["Bokeh", "Close-Up", "Moody", "Vibrant", "Macro"]
    },
    "Abstract": {
        "Anime": ["Flat", "Background", "Illustration", "Semi Realism", "Retro"],
        "Cinematic": ["Moody", "Cinematic", "Bokeh", "Minimalist", "Unprocessed"],
        "Geometry": ["2d", "3d", "Minimalist"],
        "Realism": ["Bokeh", "Close-Up", "Moody", "Vibrant", "Macro"]
    },
    "Amoled": {
        "Anime": ["Flat", "Background", "Illustration", "Semi Realism", "Retro"],
        "Cinematic": ["Moody", "Cinematic", "Bokeh", "Minimalist", "Unprocessed"],
        "Geometry": ["2d", "3d", "Minimalist"],
        "Realism": ["Bokeh", "Close-Up", "Moody", "Vibrant", "Macro"]
    },
    "Geometry": {
        "Anime": ["Flat", "Background", "Illustration", "Semi Realism", "Retro"],
        "Cinematic": ["Moody", "Cinematic", "Bokeh", "Minimalist", "Unprocessed"],
        "Geometry": ["2d", "3d", "Minimalist"],
        "Realism": ["Bokeh", "Close-Up", "Moody", "Vibrant", "Macro"]
    },
    "Landscapes": {
        "Anime": ["Flat", "Background", "Illustration", "Semi Realism", "Retro"],
        "Cinematic": ["Moody", "Cinematic", "Bokeh", "Minimalist", "Unprocessed"],
        "Geometry": ["2d", "3d", "Minimalist"],
        "Realism": ["Bokeh", "Close-Up", "Moody", "Vibrant", "Macro"]
    },
    "Minimalist": {
        "Anime": ["Flat", "Background", "Illustration", "Semi Realism", "Retro"],
        "Cinematic": ["Moody", "Cinematic", "Bokeh", "Minimalist", "Unprocessed"],
        "Geometry": ["2d", "3d", "Minimalist"],
        "Realism": ["Bokeh", "Close-Up", "Moody", "Vibrant", "Macro"]
    },
    "Pattern": {
        "Anime": ["Flat", "Background", "Illustration", "Semi Realism", "Retro"],
        "Cinematic": ["Moody", "Cinematic", "Bokeh", "Minimalist", "Unprocessed"],
        "Geometry": ["2d", "3d", "Minimalist"],
        "Realism": ["Bokeh", "Close-Up", "Moody", "Vibrant", "Macro"]
    },
    "Seasonal": {
        "Anime": ["Flat", "Background", "Illustration", "Semi Realism", "Retro"],
        "Cinematic": ["Moody", "Cinematic", "Bokeh", "Minimalist", "Unprocessed"],
        "Geometry": ["2d", "3d", "Minimalist"],
        "Realism": ["Bokeh", "Close-Up", "Moody", "Vibrant", "Macro"]
    },
    "Urban": {
        "Anime": ["Flat", "Background", "Illustration", "Semi Realism", "Retro"],
        "Cinematic": ["Moody", "Cinematic", "Bokeh", "Minimalist", "Unprocessed"],
        "Geometry": ["2d", "3d", "Minimalist"],
        "Realism": ["Bokeh", "Close-Up", "Moody", "Vibrant", "Macro"]
    },
    "Country-Side": {
        "Anime": ["Flat", "Background", "Illustration", "Semi Realism", "Retro"],
        "Cinematic": ["Moody", "Cinematic", "Bokeh", "Minimalist", "Unprocessed"],
        "Geometry": ["2d", "3d", "Minimalist"],
        "Realism": ["Bokeh", "Close-Up", "Moody", "Vibrant", "Macro"]
    },
    "Wonders": {
        "Anime": ["Flat", "Background", "Illustration", "Semi Realism", "Retro"],
        "Cinematic": ["Moody", "Cinematic", "Bokeh", "Minimalist", "Unprocessed"],
        "Geometry": ["2d", "3d", "Minimalist"],
        "Realism": ["Bokeh", "Close-Up", "Moody", "Vibrant", "Macro"]
    }
}
def create_folders(base_path="original"):
    os.makedirs(base_path, exist_ok=True)
    print(f"Created base folder: {base_path}")
    for category, subcategories in categories.items():
        for subcat, folders in subcategories.items():
            for folder in folders:
                path = os.path.join(base_path, category, subcat, folder)
                os.makedirs(path, exist_ok=True)
                print(f"Created: {path}")
if __name__ == "__main__":
    create_folders() 