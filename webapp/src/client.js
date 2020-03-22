import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import {Models} from "./models";
import {DEF_INVENTORY_ITEM_LITE, DEF_OBJECTIVE} from "./definitions";
import {OBJECTIVE_MAPPING} from "./mapping";


const API_KEY = process.env.VUE_APP_API_KEY;


Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = "https://www.bungie.net/Platform";


const ApiService = {
    get(endpoint, accessToken, params) {
        return Vue.axios.get(
            endpoint, {
                headers: {
                    "X-API-Key": API_KEY,
                    "Authorization": `Bearer ${accessToken}`
                },
                params: params ? params : {}
            }).catch(err => {
            throw new Error(`[ERROR] Get on ${endpoint}: ${err}`);
        })
    },
};

const DEF_RACE = {
    3887404748: "Human",
    2803282938: "Awoken",
    898834093: "Exo",
};

const DEF_GENDER = {
    3111576190: "Male",
    2204441813: "Female",
};

export const Client = {
    async getObjectives(accessToken) {
        if (process.env.NODE_ENV === "development") {
            const manifestResp = await ApiService.get("/Destiny2/Manifest/", accessToken);
            const manifestData = manifestResp.data;
            console.log(manifestData);
        }

        const userDataResp = await ApiService.get("/User/GetMembershipsForCurrentUser/", accessToken);
        const userResp = userDataResp.data;
        const primaryMembership = userResp.Response.primaryMembershipId;

        let membershipType = null;
        for (const [key, profile] of Object.entries(userResp.Response.destinyMemberships)) {
            if (profile.membershipId === primaryMembership) {
                membershipType = profile.membershipType;
                break
            }
        }

        const userProfileResp = await ApiService.get(
            `/Destiny2/${membershipType}/Profile/${primaryMembership}/`,
            accessToken,
            {components: "200"}
        );
        const userProfileData = userProfileResp.data;

        const characters = Object.keys(userProfileData.Response.characters.data);

        let accountObjectives = {};
        for (const charIdIndex in characters) {
            const charId = characters[charIdIndex];
            const charResp = await ApiService.get(
                `/Destiny2/${membershipType}/Profile/${primaryMembership}/Character/${charId}/`,
                accessToken,
                {components: "201,300,301"}
            );
            const charRespData = charResp.data;

            const charRace = DEF_RACE[userProfileData.Response.characters.data[charId].raceHash];
            const charGender = DEF_GENDER[userProfileData.Response.characters.data[charId].genderHash];
            const charLight = userProfileData.Response.characters.data[charId].light;

            const charDesc = `${charLight} ${charRace} ${charGender}`;

            const charItems = charRespData.Response.inventory.data.items;
            const charInstances = charRespData.Response.itemComponents.instances.data;
            const charObjectives = charRespData.Response.itemComponents.objectives.data;

            let objectives = [];
            for (const itemIndex in charItems) {
                const item = charItems[itemIndex];
                if (!item.hasOwnProperty("expirationDate")) {
                    continue
                }

                const bounty = Models.Bounty(
                    item.itemHash,
                    item.itemInstanceId,
                    DEF_INVENTORY_ITEM_LITE[item.itemHash].displayProperties.name,
                    DEF_INVENTORY_ITEM_LITE[item.itemHash].displayProperties.description,
                    item.expirationDate
                );

                for (const objIndex in charObjectives[item.itemInstanceId].objectives) {
                    const obj = charObjectives[item.itemInstanceId].objectives[objIndex];
                    const objectiveHash = obj.objectiveHash;
                    const objDetails = OBJECTIVE_MAPPING[objectiveHash];

                    if (!objDetails) {
                        console.log(
                            `WARNING: No mapping found for Objective ${objectiveHash}
                            DETAILS =======================
                            Display Name: ${DEF_INVENTORY_ITEM_LITE[item.itemHash].itemTypeDisplayName}
                            Desc: ${DEF_OBJECTIVE[objectiveHash].progressDescription}
                            Bounty Name: ${DEF_INVENTORY_ITEM_LITE[item.itemHash].displayProperties.name}
                            Bounty Desc: ${DEF_INVENTORY_ITEM_LITE[item.itemHash].displayProperties.description}
                            ===============================`
                        )
                    }

                    const activityType = objDetails ? objDetails.activity : null;
                    objectives.push(
                        Models.Objective(
                            objectiveHash,
                            DEF_OBJECTIVE[objectiveHash].progressDescription,
                            obj.progress,
                            obj.completionValue,
                            obj.completed,
                            objDetails ? objDetails.category : null,
                            activityType,
                            bounty,
                            DEF_INVENTORY_ITEM_LITE[item.itemHash].displayProperties.icon
                        )
                    )
                }
            }

            let categorizedObjectives = {};
            for (const objectiveIndex in objectives) {
                const objective = objectives[objectiveIndex];
                if (!categorizedObjectives.hasOwnProperty(objective.category)) {
                    categorizedObjectives[objective.category] = Array();
                }
                categorizedObjectives[objective.category].push(objective);
            }

            accountObjectives[charDesc] = categorizedObjectives
        }

        return accountObjectives;
    }
};
