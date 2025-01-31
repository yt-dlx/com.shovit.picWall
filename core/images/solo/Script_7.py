#=======================================================================================================================================================================================
# Script 7: Download Images to Original Folder Structure
#=======================================================================================================================================================================================
from colorama import init, Fore, Style
from dotenv import load_dotenv
from loguru import logger
from pathlib import Path
import requests
import base64
import os
init(strip=False, convert=False, autoreset=True)
OUTPUT_DIR = "output"
load_dotenv(dotenv_path="../../../.env")
GITHUB_REPO = os.getenv("GITHUB_REPO")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER")
API_URL = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
def get_all_branches():
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(f"{API_URL}/branches", headers=headers)
    return [branch["name"] for branch in response.json()] if response.ok else []
def get_branch_tree(branch):
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(f"{API_URL}/git/trees/{branch}?recursive=1", headers=headers)
    if response.ok:
        tree_data = response.json()
        if tree_data.get("truncated"):
            logger.warning(f"Tree for {branch} is truncated - some files might be missing")
        return [item["path"] for item in tree_data.get("tree", []) if item["type"] == "blob"]
    logger.error(f"Failed to fetch tree for {branch}: {response.text}")
    return []
def reconstruct_local_path(branch, remote_path):
    path_parts = remote_path.split('/')
    if len(path_parts) != 3 or path_parts[1] not in ['min', 'max']:
        logger.warning(f"Skipping invalid path format: {remote_path}")
        return None
    subfolder, file_type, filename = path_parts
    return Path(OUTPUT_DIR, f"{branch} - {subfolder}", file_type, filename)
def download_file_content(branch, remote_path):
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(
        f"{API_URL}/contents/{remote_path}?ref={branch}",
        headers=headers
    )
    if response.ok:
        return base64.b64decode(response.json()["content"])
    logger.error(f"Download failed for {remote_path}: {response.text}")
    return None
def save_file(local_path, content):
    local_path.parent.mkdir(parents=True, exist_ok=True)
    with open(local_path, "wb") as f:
        f.write(content)
    print(f"{Fore.CYAN}DOWNLOADED:{Style.RESET_ALL} {local_path}")
def process_branch(branch):
    print(f"{Fore.YELLOW}PROCESSING BRANCH:{Style.RESET_ALL} {branch}")
    remote_paths = get_branch_tree(branch)
    for remote_path in remote_paths:
        local_path = reconstruct_local_path(branch, remote_path)
        if not local_path:
            continue
        if local_path.exists():
            print(f"{Fore.BLUE}SKIPPING EXISTING:{Style.RESET_ALL} {local_path}")
            continue
        content = download_file_content(branch, remote_path)
        if content:
            save_file(local_path, content)
def main():
    print(f"{Fore.GREEN}STARTING DOWNLOAD{Style.RESET_ALL}")
    branches = get_all_branches()
    if not branches:
        logger.error("No branches found in repository")
        return
    for branch in branches:
        process_branch(branch)
    print(f"{Fore.GREEN}DOWNLOAD COMPLETED{Style.RESET_ALL}")
if __name__ == "__main__":
    main()