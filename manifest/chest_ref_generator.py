from pathlib import Path
import json

def generate_name(file_name):
    return file_name.replace("_", " ").title()

def generate_chests_ref(loot_tables_dir):
    loot_chests = []
    for f in loot_tables_dir.glob("*.json"):
        obj = {
            "path": f"data/loot_table/{f.name}",
            "name": generate_name(f.stem),
            "id": f"{f.stem}"
        }
        loot_chests.append(obj)
    return loot_chests

def main():
    project_dir = Path(__file__).parent.parent
    loot_table_dir = project_dir / "data/loot_table"
    manifest_dir = project_dir / "manifest"

    loot_chests_list = generate_chests_ref(loot_table_dir)

    with open(f"{manifest_dir}/chest_ref.json", "w") as f:
        json.dump(loot_chests_list, f, indent=4)

main()