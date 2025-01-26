#=======================================================================================================================================================================================
# Script 0: Create the Original Folders
#=======================================================================================================================================================================================
import os
main_folder = "image"
sub_topics = [
    "Serene", "Urban", "Landscapes", "Geometry", "Abstract", "Minimalism", 
    "Ethereal", "Nature", "Vintage", "Vehicles", "Cyberpunk"
]
models = ["Anime", "Cinematic", "Geometry"]
if not os.path.exists(main_folder):
    os.makedirs(main_folder)
for sub_topic in sub_topics:
    sub_topic_path = os.path.join(main_folder, sub_topic)
    if not os.path.exists(sub_topic_path):
        os.makedirs(sub_topic_path)
    for model in models:
        model_path = os.path.join(sub_topic_path, model)
        if not os.path.exists(model_path):
            os.makedirs(model_path)
print("Folder structure created successfully!")