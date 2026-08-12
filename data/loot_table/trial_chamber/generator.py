from pathlib import Path
import json

def main():
    LOOT_TABLE_NAMES = ["trial_chamber_vault", "trial_chamber_ominous_vault"]

    loot_tables_dir = Path(__file__).parent

    for loot_table_name in LOOT_TABLE_NAMES:
        with open(f"{loot_tables_dir/loot_table_name}.json", "r") as f:
            loot_table = json.load(f)
            # print(loot_table)
            new_pools = []

            for pool in loot_table["pools"]:
                new_entries = []
                for entry in pool["entries"]:
                    if "weight" not in entry:
                        entry["weight"] = 1
                    sub_table_name = entry["value"].removeprefix("minecraft:chests/trial_chambers/")
                    with open(f"{loot_tables_dir}/vaults/{sub_table_name}.json") as sf:
                        sub_table = json.load(sf)
                        for sub_table_entry in sub_table["pools"][0]["entries"]:
                            if "weight" not in sub_table_entry:
                                sub_table_entry["weight"] = 1
                            sub_table_entry["weight"] *= entry["weight"]
                            new_entries.append(sub_table_entry)
                pool["entries"] = new_entries
                new_pools.append(pool)
        loot_table["pools"] = new_pools
                
        print(loot_table)

        with open(f"{loot_tables_dir.parent}/{loot_table_name}.json", "w") as f:
            json.dump(loot_table, f, indent=4)
main()