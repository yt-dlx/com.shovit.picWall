#=======================================================================================================================================================================================
# Script 5: Metadata Creation for Database
#=======================================================================================================================================================================================
from colorama import init, Fore, Style
from colorthief import ColorThief
from loguru import logger
from PIL import Image
import os
import re
init(strip=False, convert=False, autoreset=True)
def create_temp_resized_image(file_path, size=(300, 300)):
    with Image.open(file_path) as img:
        img.thumbnail(size)
        temp_path = "temp.jpg"
        img.save(temp_path, "JPEG")
    return temp_path
def get_top_colors(file_path, num_colors=10):
    return [f"#{r:02x}{g:02x}{b:02x}" for r, g, b in ColorThief(file_path).get_palette(color_count=num_colors, quality=1)]
def get_image_metadata(file_path):
    with Image.open(file_path) as img:
        return {"format": img.format, "mode": img.mode, "width": img.width, "height": img.height}
def create_image_data(file_path, branch_name, folder_name, type_):
    temp_file_path = create_temp_resized_image(file_path)
    try:
        hex_colors = get_top_colors(temp_file_path, num_colors=10)
    finally:
        os.remove(temp_file_path)
    file_metadata = get_image_metadata(file_path)
    file_size = os.path.getsize(file_path)
    print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Created image data for: {file_path}")
    return {
        "original_file_name": os.path.basename(file_path),
        "megabytes": round(file_size / (1024 * 1024), 2), 
        "format": file_metadata["format"],
        "height": file_metadata["height"],
        "width": file_metadata["width"],
        "mode": file_metadata["mode"],
        "secondary": hex_colors[1],
        "primary": hex_colors[0],
        "tertiary": hex_colors[2],
        "branch": branch_name,
        "folder": folder_name,
        "bytes": file_size,
        "type": type_,
    }
def process_images_in_folder(base_path, branch_name, folder_name):
    parent_data = {}
    for subfolder in ["min", "max"]:
        subfolder_path = os.path.join(base_path, subfolder)
        if not os.path.isdir(subfolder_path):
            print(f"{Fore.YELLOW}WARNING:{Style.RESET_ALL} Subfolder '{subfolder}' not found in {base_path}. Skipping.")
            continue
        for root, _, files in os.walk(subfolder_path):
            for file_name in files:
                file_path = os.path.join(root, file_name)
                if os.path.isfile(file_path) and file_name.lower().endswith((".jpg")):
                    try:
                        print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Processing file: {file_path}")
                        image_data = create_image_data(file_path, branch_name, folder_name, subfolder)
                        base_name = re.sub(r"\s*\(\d+\)$", "", os.path.splitext(file_name)[0]).strip()
                        if base_name not in parent_data:
                            parent_data[base_name] = {base_name: {"environment_title": base_name, "images": []}}
                        parent_data[base_name][base_name]["images"].append(image_data)
                    except Exception as e:
                        logger.error(f"Failed to process file: {file_name}. Error: {str(e)}")
                else:
                    print(f"{Fore.YELLOW}WARNING:{Style.RESET_ALL} Skipped file (not an image or unsupported format): {file_name}")
    return parent_data
def sanitize_filename(name):
    return re.sub(r"[^\w\s-]", "", name).strip()
def write_output_file(output_ts_path, parent_data):
    os.makedirs(os.path.dirname(output_ts_path), exist_ok=True)
    file_name = os.path.basename(output_ts_path)
    variable_name = file_name.split('.')[0].replace(" - ", "_").replace(" ", "_")
    with open(output_ts_path, "w") as ts_file:
        ts_file.write(f"import {{ EnvironmentEntry }} from \"../types\";\n")
        ts_file.write(f"const {variable_name}: Record<string, EnvironmentEntry> = {{\n")
        for environment, data in parent_data.items():
            environment_title = environment
            images = data.get(environment)["images"]
            ts_file.write(f"  \"{environment_title}\": {{\n")
            ts_file.write(f"    environment_title: \"{environment_title}\",\n")
            ts_file.write(f"    images: [\n")
            for image in images:
                ts_file.write(f"      {{\n")
                for key, value in image.items():
                    ts_file.write(f"        {key}: \"{value}\",\n" if isinstance(value, str) else f"        {key}: {value},\n")
                ts_file.write(f"      }},\n")
            ts_file.write(f"    ]\n")
            ts_file.write(f"  }},\n")
        ts_file.write(f"}};\n")
        ts_file.write(f"export default {variable_name};\n")
    print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Output written successfully to: {output_ts_path}")
output_base_dir = os.path.join(".", "output")
folder_paths = [(folder, os.path.join(output_base_dir, folder)) for folder in os.listdir(output_base_dir) if os.path.isdir(os.path.join(output_base_dir, folder))]
for folder_name, folder_path in folder_paths:
    try:
        if " - " not in folder_name:
            raise ValueError(f"Folder name '{folder_name}' does not match expected format 'Branch - Relative Path'")
        branch_name, relative_path = map(str.strip, folder_name.split(" - ", 1))
        combined_folder_name = f"{branch_name} - {relative_path}"
        parent_data = process_images_in_folder(folder_path, branch_name, relative_path)
        sanitized_folder_name = sanitize_filename(combined_folder_name)
        output_ts_path = os.path.join("data", f"{sanitized_folder_name}.ts")
        write_output_file(output_ts_path, parent_data)
    except ValueError as e:
        logger.error(str(e))