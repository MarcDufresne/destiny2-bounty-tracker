import {OBJECTIVE_MAPPING} from "./mapping";

if (process.env.NODE_ENV === "development"){
    const DEF_INVENTORY_ITEM_FULL = require("./definitions/DestinyInventoryItemDefinition.json");
} else {
    const DEF_INVENTORY_ITEM_FULL = {}
}

export const DevUtils = {
    findUnmappedObjectives() {
        let res = "";
        for (const itemIndex in DEF_INVENTORY_ITEM_FULL) {
            const item = DEF_INVENTORY_ITEM_FULL[itemIndex];
            if (item.itemType !== 26) {
                continue
            }
            let msg = "";
            msg += `
            ============================================================================
            Bounty Name: ${item.displayProperties.name}
            Bounty Desc: ${item.displayProperties.description}
            Bounty Type: ${item.itemTypeDisplayName}
            Inv Type:    ${item.inventory.stackUniqueLabel}
            Objectives:`;
            let skip = false;
            for (const objIndex in item.objectives.objectiveHashes) {
                const objId = item.objectives.objectiveHashes[objIndex];
                if (OBJECTIVE_MAPPING.hasOwnProperty(objId)) {
                    console.log(`Skipping obj ${objId}`);
                    skip = true;
                }
                msg += `
                Obj ID:   ${objId}
                Obj Desc: ${DEF_OBJECTIVE[objId].progressDescription}
                `
            }
            if (!skip) {
                res += msg;
            }
        }
        console.log(res);
    }
};