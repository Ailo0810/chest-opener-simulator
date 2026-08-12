from pathlib import Path
import json

supported_items_count = {}

dir = Path(__file__).parent

for i, enchantment_file in enumerate(dir.glob("*.json"), start=1):
    with enchantment_file.open("r") as file:
        enchantment = json.load(file)
        supported_item = enchantment["supported_items"]
        supported_items_count[supported_item] = supported_items_count.get(supported_item, 0) + 1
                

print("\nSupported items:")
for i, (name, count) in enumerate(supported_items_count.items(), start=1):
    print(f"{i}. `{name}`: {count}")