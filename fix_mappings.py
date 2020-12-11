import json
import re


if __name__ == '__main__':
    with open("webapp/src/definitions/DestinyInventoryItemDefinition.json", mode="r") as f:
        all_inv = json.loads(f.read())

    with open("webapp/src/mapping.js", mode="r") as f:
        mapping_lines = []
        for line in f.readlines():
            if re.match(r"\s+\"\d+\".*", line):
                if "//" in line:
                    line = line[:line.index("//")]
                mapping_lines.append(line.strip())

    objectives = {}
    for inv_id, inv in all_inv.items():
        if "objectives" in inv and "Bounty" in inv.get("itemTypeDisplayName", ""):
            for obj_hash in inv["objectives"]["objectiveHashes"]:
                objectives[str(obj_hash)] = inv["inventory"]["stackUniqueLabel"]

    for line in mapping_lines:
        m = re.match(r"\"(\d+)\".*", line)
        obj_id = m.groups()[0]

        stack_label = objectives.get(obj_id)

        if stack_label:
            line += f"  // {stack_label}"
            print(line)
