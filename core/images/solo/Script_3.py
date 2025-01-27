#=======================================================================================================================================================================================
# Script 3: Image Enhancement And Upscaling
#=======================================================================================================================================================================================
from colorama import init, Fore
import subprocess
import json
import os
init(strip=False, convert=False, autoreset=True)
input_base_path = os.path.join(".", "input")
output_base_path = os.path.join(".", "upscaled")
tracking_file_path = os.path.join(".", "upscaled.json")
model_path = os.path.join("..", "..", "include", "real-esrgan", "models")
engine_path = os.path.join("..", "..", "include", "real-esrgan", "engine.exe")
if not os.path.exists(input_base_path):
    raise FileNotFoundError(f"Input directory does not exist: {input_base_path}")
if not os.path.exists(output_base_path):
    os.makedirs(output_base_path, exist_ok=True)
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model path does not exist: {model_path}")
if not os.path.exists(engine_path):
    raise FileNotFoundError(f"Engine executable not found: {engine_path}")
if os.path.exists(tracking_file_path):
    with open(tracking_file_path, "r") as tracking_file:
        processed_files = json.load(tracking_file)
else:
    processed_files = {}
for root, _, files in os.walk(input_base_path):
    if os.path.abspath(root).startswith(os.path.abspath(output_base_path)):
        continue
    for file in files:
        if file.lower().endswith((".jpg")):
            input_image_path = os.path.join(root, file)
            relative_path = os.path.relpath(root, input_base_path)
            output_dir = os.path.join(output_base_path, relative_path)
            os.makedirs(output_dir, exist_ok=True)
            output_image_path = os.path.join(output_dir, file)
            if input_image_path in processed_files:
                print(f"{Fore.YELLOW}SKIP:{Fore.RESET} Already processed: {input_image_path}")
                continue
            command = [engine_path, "-i", input_image_path, "-o", output_image_path, "-n", "realesrgan-x4plus", "-m", model_path, "-t", "256", "-s", "4"]
            print(f"{Fore.MAGENTA}DEBUG:{Fore.RESET} Command: {' '.join(command)}")
            try:
                result = subprocess.run(command, capture_output=True, check=True, text=True)
                print(f"{Fore.GREEN}INFO:{Fore.RESET} Successfully processed and output saved to: {output_image_path}")
                processed_files[input_image_path] = output_image_path
                with open(tracking_file_path, "w") as tracking_file:
                    json.dump(processed_files, tracking_file, indent=4)
            except subprocess.CalledProcessError as e:
                print(f"{Fore.RED}ERROR:{Fore.RESET} Failed to process {file}.")
                print(f"{Fore.RED}ERROR:{Fore.RESET} Return Code: {e.returncode}")
                print(f"{Fore.RED}ERROR:{Fore.RESET} Standard Output: {e.stdout}")
                print(f"{Fore.RED}ERROR:{Fore.RESET} Standard Error: {e.stderr}")