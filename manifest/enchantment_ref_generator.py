from pathlib import Path
import json

def generate_name(file_name):
    return file_name.replace("_", " ").title()

def generate_enchantments_ref(enchantments_dir):
    enchantemtns = []
    for f in enchantments_dir.glob("*.json"):
        obj = {
            "path": f"data/enchantment/{f.name}",
            "id": f"minecraft:{f.stem}"
        }
        enchantemtns.append(obj)
    return enchantemtns

def main():
    project_dir = Path(__file__).parent.parent
    enchantment_dir = project_dir / "data/enchantment"
    manifest_dir = project_dir / "manifest"

    enchantments_list = generate_enchantments_ref(enchantment_dir)

    with open(f"{manifest_dir}/enchantment_ref.json", "w") as f:
        json.dump(enchantments_list, f, indent=4)

main()