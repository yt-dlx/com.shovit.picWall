#====================================================================================================================
# Script 4: Watermarking Images
#====================================================================================================================
from colorama import init, Fore, Style
from loguru import logger
from PIL import Image
import os
portrait_size = (360, 640)
landscape_size = (640, 360)
init(strip=False, convert=False, autoreset=True)
def add_watermark_to_image(input_path, output_max_path, output_min_path, logo_path, opacity=204):
    try:
        image = Image.open(input_path).convert("RGBA")
        original_format = image.format
        watermark = Image.new("RGBA", image.size, (255, 255, 255, 0))
        logo = Image.open(logo_path).convert("RGBA")
        max_size = min(image.size) // 5
        logo.thumbnail((max_size, max_size), Image.LANCZOS)
        position = ((image.size[0] - logo.size[0]) // 2, (image.size[1] - logo.size[1]) // 2)
        watermark.paste(logo, position, logo)
        watermarked_image = Image.alpha_composite(image, watermark).convert("RGB")
        watermarked_image.save(output_max_path, format=original_format, quality=80, optimize=True)
        print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Saved Watermarked Image (max): {output_max_path}")
        aspect_ratio = image.width / image.height
        resized_size = portrait_size if aspect_ratio < 1 else landscape_size
        resized_image = watermarked_image.resize(resized_size, Image.LANCZOS)
        resized_image.save(output_min_path, format=original_format, quality=80, optimize=True)
        print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Saved Watermarked Image (min): {output_min_path}")
    except Exception as e:
        logger.error(f"Failed to process {input_path}: {e}")
def process_images_recursively(input_folder, output_folder_base, logo_path):
    for root, _, files in os.walk(input_folder):
        for filename in files:
            input_path = os.path.join(root, filename)
            if filename.lower().endswith((".png", ".jpg", ".jpeg")):
                relative_path = os.path.relpath(input_path, input_folder)
                parent_folder = os.path.basename(input_folder)
                subfolder = os.path.basename(os.path.dirname(input_path))
                combined_folder_name = f"{parent_folder} - {subfolder}"
                output_max_folder = os.path.join(output_folder_base, combined_folder_name, "max")
                output_min_folder = os.path.join(output_folder_base, combined_folder_name, "min")
                output_max_path = os.path.join(output_max_folder, filename)
                output_min_path = os.path.join(output_min_folder, filename)
                os.makedirs(os.path.dirname(output_max_path), exist_ok=True)
                os.makedirs(os.path.dirname(output_min_path), exist_ok=True)
                add_watermark_to_image(input_path, output_max_path, output_min_path, logo_path)
            else:
                print(f"{Fore.YELLOW}WARNING:{Style.RESET_ALL} Skipped non-image file: {filename}")
def main():
    output_base_dir = os.path.join(".", "output")
    input_base_dir = os.path.join(".", "upscaled")
    if not os.path.exists(input_base_dir):
        print(f"{Fore.RED}ERROR:{Style.RESET_ALL} Input base directory not found: {input_base_dir}")
        return
    logo_path = os.path.join("..", "..", "include", "logo_white.png")
    if not os.path.isfile(logo_path):
        print(f"{Fore.RED}ERROR:{Style.RESET_ALL} Logo file not found: {logo_path}")
        return
    input_folders = [os.path.join(input_base_dir, folder) for folder in os.listdir(input_base_dir) if os.path.isdir(os.path.join(input_base_dir, folder))]
    if not input_folders:
        print(f"{Fore.YELLOW}WARNING:{Style.RESET_ALL} No subfolders found in input directory: {input_base_dir}")
        return
    for input_folder in input_folders:
        process_images_recursively(input_folder, output_base_dir, logo_path)
    print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Watermark processing complete.")
if __name__ == "__main__":
    main()