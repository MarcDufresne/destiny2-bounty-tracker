import {OBJECTIVE_MAPPING} from "./mapping";
import {DEF_OBJECTIVE} from "./definitions";

let DEF_INVENTORY_ITEM_FULL;
if (process.env.NODE_ENV === "development"){
    DEF_INVENTORY_ITEM_FULL = require("./definitions/DestinyInventoryItemDefinition.json");
} else {
    DEF_INVENTORY_ITEM_FULL = {}
}

export function devConsoleLog(message) {
    if (process.env.NODE_ENV === "development") {
        console.log(message);
    }
}

export const DevUtils = {
    findUnmappedObjectives() {
        let resData = [];
        for (const itemIndex in DEF_INVENTORY_ITEM_FULL) {
            const item = DEF_INVENTORY_ITEM_FULL[itemIndex];
            if (!item.hasOwnProperty("objectives") || !item.itemTypeDisplayName.includes("Bounty")) {
                continue
            }
            for (const objIndex in item.objectives.objectiveHashes) {
                const objId = item.objectives.objectiveHashes[objIndex];
                if (OBJECTIVE_MAPPING.hasOwnProperty(objId)) {
                    continue;
                }
                let objData = {
                    name: item.displayProperties.name,
                    description: item.displayProperties.description,
                    type: item.itemTypeDisplayName,
                    invType: item.inventory.stackUniqueLabel,
                    objectiveId: objId,
                    objectiveDescription: DEF_OBJECTIVE[objId].progressDescription,
                    icon: item.displayProperties.icon,
                    activityType: undefined,
                    objectiveType: undefined,
                };
                resData.push(objData);
            }
        }
        console.log(JSON.stringify(resData));
        return resData;
    }
};
