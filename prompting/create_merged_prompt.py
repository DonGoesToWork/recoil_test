import os

this_folder = "E:/web_dev/loot_quest/prompting"
root_path = "E:/web_dev/loot_quest/project_zero"

output_file = f"{this_folder}/merged_prompt.txt"

# Example for first N lines:
# (f"{this_folder}/some_other_large_file.log", {"lines": 50, "mode": "first"}),

# Example for last N lines:
# (f"{this_folder}/some_other_large_file.log", {"lines": 50, "mode": "last"}),

# f"{this_folder}/test_errors.txt",
# f"{this_folder}/merged_prompt_template_divider.txt",

"""
(f"{root_path}/minimap_module/temp/minimap_vision.log", {"lines": 150, "mode": "first"}),
f"{this_folder}/merged_prompt_template_divider.txt",
(f"{root_path}/minimap_module/temp/minimap_vision.log", {"lines": 350, "mode": "last"}),
"""

files_to_combine = [
    f"{this_folder}/merged_prompt_template.txt",
    # f"{root_path}/minimap_module/temp/minimap_vision.log",
]

# f"{root_path}/tests",
folders_to_combine = [
    f"{root_path}/backend/src",
    f"{root_path}/frontend/src",
]

def combine_files():
    with open(output_file, 'w', encoding='utf-8') as outfile_handle:
        print(f"Writing combined content to: {output_file}\n")

        # --- 1. Process specific files from files_to_combine ---
        if files_to_combine:
            for item in files_to_combine:
                current_filepath = ""
                options = {}

                if isinstance(item, str):
                    current_filepath = item
                elif isinstance(item, tuple) and len(item) == 2 and isinstance(item[0], str) and isinstance(item[1], dict):
                    current_filepath = item[0]
                    options = item[1]
                else:
                    print(f"Skipping invalid item in files_to_combine: {item}")
                    continue

                if os.path.exists(current_filepath) and os.path.isfile(current_filepath):
                    print(f"Processing file: {current_filepath}")
                    try:
                        with open(current_filepath, 'r', encoding='utf-8') as infile_handle:
                            header_comment_suffix = ""
                            content_to_write = ""

                            if 'lines' in options:
                                num_lines_to_take = options.get('lines')
                                mode = options.get('mode', 'last')  # Default to 'last' if mode not specified

                                all_lines = infile_handle.readlines()
                                total_lines_in_file = len(all_lines)

                                if mode == 'last':
                                    lines_subset = all_lines[-num_lines_to_take:]
                                    actual_taken = len(lines_subset)
                                    header_comment_suffix = f" (last {actual_taken} of {total_lines_in_file} lines)"
                                elif mode == 'first':
                                    lines_subset = all_lines[:num_lines_to_take]
                                    actual_taken = len(lines_subset)
                                    header_comment_suffix = f" (first {actual_taken} of {total_lines_in_file} lines)"
                                else:
                                    print(f"  Warning: Unknown mode '{mode}' for {current_filepath}. Reading entire file.")
                                    lines_subset = all_lines # Fallback to all lines
                                    header_comment_suffix = f" (all {total_lines_in_file} lines - mode '{mode}' unknown)"
                                
                                content_to_write = "".join(lines_subset)
                            else:
                                # No options, read the whole file
                                content_to_write = infile_handle.read()

                            outfile_handle.write(f"\n# {current_filepath}{header_comment_suffix}\n")
                            outfile_handle.write(content_to_write)

                    except Exception as e:
                        print(f"Error reading file {current_filepath}: {e}. Skipping.")
                else:
                    print(f"File not found or is a directory: {current_filepath}. Skipping.")


        # --- 2. Process Web files from folders_to_combine ---
        if folders_to_combine:
            for folder_path in folders_to_combine:
                if os.path.exists(folder_path) and os.path.isdir(folder_path):
                    print(f"Processing folder: {folder_path}")
                    for dirpath, dirnames, filenames in os.walk(folder_path):
                        # Sort filenames to ensure a consistent order (optional, but good practice)
                        filenames.sort()
                        for filename in filenames:
                            if filename.endswith(".ts") or filename.endswith(".tsx") or filename.endswith(".css"):
                                web_filepath = os.path.join(dirpath, filename)
                                print(f"  Processing Web file: {web_filepath}")
                                try:
                                    with open(web_filepath, 'r', encoding='utf-8') as infile_handle:
                                        outfile_handle.write(f"\n# {filename}\n")
                                        outfile_handle.write(infile_handle.read())
                                except Exception as e:
                                    print(f"  Error reading Web file {web_filepath}: {e}. Skipping.")
                else:
                    print(f"Folder not found: {folder_path}. Skipping.")

    print(f"\nSuccessfully combined files into {output_file}")

if __name__ == "__main__":
    combine_files()