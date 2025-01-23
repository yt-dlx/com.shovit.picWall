#=======================================================================================================================================================================================
# Script 2: Rename And Remove Duplicates
#=======================================================================================================================================================================================
from colorama import init, Fore, Style
from loguru import logger
import hashlib
import os
import re
init(strip=False, convert=False, autoreset=True)
def calculate_file_hash(file_path):
    hash_algo = hashlib.sha256()
    try:
        with open(file_path, "rb") as f:
            while chunk := f.read(8192):
                hash_algo.update(chunk)
        return hash_algo.hexdigest()
    except Exception as e:
        print(f"{Fore.RED}ERROR:{Style.RESET_ALL} Could not calculate hash for {file_path}: {e}")
        return None
def rename_and_remove_duplicates(base_directory):
    file_hashes = set()
    for root, dirs, files in os.walk(base_directory):
        file_count = {}
        for file in files:
            if file.endswith(".jpg"):
                file_path = os.path.join(root, file)
                file_hash = calculate_file_hash(file_path)
                if file_hash in file_hashes:
                    print(f"{Fore.YELLOW}INFO:{Style.RESET_ALL} Duplicate removed: {file_path}")
                    os.remove(file_path)
                    continue
                else:
                    file_hashes.add(file_hash)
                match = re.match(r"^\s*([\w']+\s+[\w']+)", file)
                if match:
                    new_base_name = match.group(1)
                    if new_base_name not in file_count:
                        file_count[new_base_name] = 0
                    file_count[new_base_name] += 1
                    new_file_name = f"{new_base_name} ({file_count[new_base_name]}).jpg"
                    new_path = os.path.join(root, new_file_name)
                    try:
                        os.rename(file_path, new_path)
                        print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Renamed: {file_path} -> {new_path}")
                    except Exception as e:
                        print(f"{Fore.RED}ERROR:{Style.RESET_ALL} Could not rename {file_path}: {e}")
rename_and_remove_duplicates(os.path.join(".", "input"))