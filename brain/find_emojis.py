import os
import re
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

# Regex for matching emojis
emoji_pattern = re.compile(
    r'[\U0001F000-\U0001FFFF]' # All emoji blocks in planes 1 & 2
    r'|[\u2600-\u27BF]'       # Miscellaneous symbols/dingbats
)

src_dir = r"c:\Users\SANTHU\OneDrive\Desktop\Projects\skylimit\src"

found_any = False
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                file_printed = False
                for idx, line in enumerate(lines, 1):
                    if emoji_pattern.search(line):
                        if not file_printed:
                            print(f"\nFile: {path}")
                            file_printed = True
                            found_any = True
                        print(f"  Line {idx}: {line.strip()}")
            except Exception as e:
                pass

if not found_any:
    print("No emojis found.")
