#=======================================================================================================================================================================================
# Script 0: Create the Opposite Folder Structure
#=======================================================================================================================================================================================
import os
main_folder = "input"
models = ["Anime", "Cinematic", "Geometry", "Photography"]
sub_topics = ["Nature", "Minimalism", "Abstract", "Synthwave", "Retro"]
if not os.path.exists(main_folder):
    os.makedirs(main_folder)
for model in models:
    model_path = os.path.join(main_folder, model)
    if not os.path.exists(model_path):
        os.makedirs(model_path)
    for sub_topic in sub_topics:
        sub_topic_path = os.path.join(model_path, sub_topic)
        if not os.path.exists(sub_topic_path):
            os.makedirs(sub_topic_path)
print("Opposite folder structure created successfully!")