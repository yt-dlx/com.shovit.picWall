#=======================================================================================================================================================================================
# Script 6: Upload Images From Folders
#=======================================================================================================================================================================================
from colorama import init, Fore, Style
from dotenv import load_dotenv
from loguru import logger
from pathlib import Path
import requests
import base64
import json
import os
init(strip=False, convert=False, autoreset=True)
load_dotenv(dotenv_path="../../../.env")
UPLOAD_TRACKER = "upload.json"
GITHUB_REPO = os.getenv("GITHUB_REPO")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER")
API_URL = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
def load_upload_tracker():
    if os.path.exists(UPLOAD_TRACKER):
        with open(UPLOAD_TRACKER, 'r') as f:
            return json.load(f)
    return {"uploaded_files": {}}
def save_upload_tracker(tracker_data):
    with open(UPLOAD_TRACKER, 'w') as f:
        json.dump(tracker_data, f, indent=2)
def get_directories(base_path):
    directories = [path for path in Path(base_path).iterdir() if path.is_dir()]
    print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Found directories: {', '.join(str(d) for d in directories)}")
    return directories
def get_branch_sha(branch_name):
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(f"{API_URL}/git/ref/heads/{branch_name}", headers=headers)
    if response.ok:
        return response.json()["object"]["sha"]
    else:
        logger.error(f"Error fetching SHA for branch {branch_name}: {response.text}")
        return None
def create_branch(branch_name):
    print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Creating branch: {branch_name} using 'empty' branch as base")
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    empty_branch_sha = get_branch_sha("empty")
    if not empty_branch_sha:
        logger.error("Failed to fetch SHA for 'empty' branch. Cannot create new branch.")
        return False
    payload = {"ref": f"refs/heads/{branch_name}", "sha": empty_branch_sha}
    response = requests.post(f"{API_URL}/git/refs", headers=headers, json=payload)
    if response.ok:
        print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Branch {branch_name} created successfully.")
        initialize_branch_with_placeholder(branch_name)
        return True
    else:
        logger.error(f"Error creating branch {branch_name}: {response.text}")
        return False
def initialize_branch_with_placeholder(branch):
    print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Initializing branch: {branch}")
    placeholder_path = "placeholder.txt"
    with open(placeholder_path, "w") as f:
        f.write("This is a placeholder file to initialize the branch.")
    try:
        upload_file_to_github(placeholder_path, "placeholder.txt", branch, {"uploaded_files": {}})
    finally:
        os.remove(placeholder_path)
def ensure_branch_exists(branch_name):
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(f"{API_URL}/git/ref/heads/{branch_name}", headers=headers)
    if not response.ok:
        return create_branch(branch_name)
    return True
def fetch_all_remote_files():
    remote_files = {}
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    def fetch_branch_files(branch):
        files = []
        response = requests.get(f"{API_URL}/git/trees/{branch}?recursive=1",headers=headers)
        if response.ok:
            tree = response.json().get("tree", [])
            files.extend([item["path"] for item in tree if item["type"] == "blob"])
        return files
    response = requests.get(f"{API_URL}/branches", headers=headers)
    if response.ok:
        branches = [branch["name"] for branch in response.json()]
        for branch in branches:
            remote_files[branch] = fetch_branch_files(branch)
    return remote_files
def upload_file_to_github(file_path, remote_path, branch, tracker_data):
    if tracker_data["uploaded_files"].get(branch, {}).get(remote_path):
        print(f"{Fore.YELLOW}INFO:{Style.RESET_ALL} File {remote_path} already tracked as uploaded. Skipping.")
        return
    with open(file_path, "rb") as f:
        content = base64.b64encode(f.read()).decode()
    headers = {"Authorization": f"token {GITHUB_TOKEN}","Content-Type": "application/json"}
    response = requests.put(f"{API_URL}/contents/{remote_path}",headers=headers,json={"message": "picWall™ AI", "content": content, "branch": branch})
    if response.ok:
        if branch not in tracker_data["uploaded_files"]:
            tracker_data["uploaded_files"][branch] = {}
        tracker_data["uploaded_files"][branch][remote_path] = True
        save_upload_tracker(tracker_data)
    else:
        logger.error(f"Error uploading file {remote_path}: {response.text}")
def process_directory(directory, subdir_type, remote_files, tracker_data):
    folder_name = directory.name
    branch_name, sub_folder_name = [part.strip() for part in folder_name.split(" - ", 1)]
    print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Processing {subdir_type} files in directory: {directory}")
    if not ensure_branch_exists(branch_name):
        logger.error(f"Failed to ensure branch exists: {branch_name}")
        return
    subdir_path = directory / subdir_type
    if subdir_path.is_dir():
        for file in subdir_path.iterdir():
            if file.is_file():
                remote_path = f"{sub_folder_name}/{subdir_type}/{file.name}"
                if (remote_path not in remote_files.get(branch_name, []) and 
                    not tracker_data["uploaded_files"].get(branch_name, {}).get(remote_path)):
                    print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Uploading: {file}")
                    upload_file_to_github(str(file), remote_path, branch_name, tracker_data)
                else:
                    print(f"{Fore.YELLOW}INFO:{Style.RESET_ALL} File {file} already exists. Skipping.")
def main():
    print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} Fetching all remote files...")
    remote_files = fetch_all_remote_files()
    tracker_data = load_upload_tracker()
    directories = get_directories(os.path.join(".", "output"))
    for directory in directories:
        process_directory(directory, "min", remote_files, tracker_data)
    for directory in directories:
        process_directory(directory, "max", remote_files, tracker_data)
    print(f"{Fore.GREEN}INFO:{Style.RESET_ALL} All directories processed successfully.")
if __name__ == "__main__":
    main()