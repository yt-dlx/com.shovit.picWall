import os
import hashlib
def calculate_hash(file_path, chunk_size=1024):
    hash_obj = hashlib.sha256()
    try:
        with open(file_path, "rb") as f:
            while chunk := f.read(chunk_size):
                hash_obj.update(chunk)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None
    return hash_obj.hexdigest()
def find_and_delete_duplicates(directory):
    if not os.path.isdir(directory):
        print(f"{directory} is not a valid directory.")
        return
    file_hashes = {}
    duplicates = []
    for root, _, files in os.walk(directory):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            file_hash = calculate_hash(file_path)
            if file_hash:
                if file_hash in file_hashes:
                    duplicates.append(file_path)
                else:
                    file_hashes[file_hash] = file_path
    print(f"\nDuplicates found in {directory}:")
    for dup in duplicates:
        print(dup)
        try:
            os.remove(dup)
            print(f"Deleted: {dup}")
        except Exception as e:
            print(f"Error deleting {dup}: {e}")
def rename_images_in_subfolders(directory):
    if not os.path.isdir(directory):
        print(f"{directory} is not a valid directory.")
        return
    for root, _, files in os.walk(directory):
        jpg_files = [f for f in files if f.lower().endswith(".jpg")]
        for index, file_name in enumerate(sorted(jpg_files)):
            old_path = os.path.join(root, file_name)
            new_name = f"image ({index}).jpg"
            new_path = os.path.join(root, new_name)
            try:
                os.rename(old_path, new_path)
                print(f"Renamed: {old_path} -> {new_path}")
            except Exception as e:
                print(f"Error renaming {old_path}: {e}")
if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_path = os.path.join(script_dir)
    subdirectories = [
        os.path.join(base_path, folder)
        for folder in os.listdir(base_path)
        if os.path.isdir(os.path.join(base_path, folder))
    ]
    for dir_path in subdirectories:
        print(f"\nProcessing {dir_path}...")
        find_and_delete_duplicates(dir_path)
        rename_images_in_subfolders(dir_path)