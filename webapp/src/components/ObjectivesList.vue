<template>
    <v-container fluid>
        <v-row>
            <v-container v-for="(category_objectives, category_name) in objectives"
                         v-bind:key="category_name"
            >
                <h3>{{ formatName(category_name) }}</h3>
                <ObjectivesCategory :objectives="category_objectives" :selectedActivityFilters="selectedActivityFilters" />
            </v-container>
        </v-row>
    </v-container>
</template>

<script>
    import ObjectivesCategory from "./ObjectivesCategory";

    export default {
        name: "ObjectivesList",
        components: {ObjectivesCategory},
        props: ["objectives", "selectedActivityFilters"],
        data: () => ({
            formattedNames: {
                null: "General",
                "kinetic": "Kinetic Weapons",
                "energy": "Energy Weapons",
                "power": "Power Weapons",
                "hand_cannon": "Hand Cannon",
                "submachine_gun": "Submachine Gun",
                "auto_rifle": "Auto Rifle",
                "fusion_rifle": "Fusion Rifle",
                "linear_fusion_rifle": "Linear Fusion Rifle",
                "sniper_rifle": "Sniper Rifle",
                "pulse_rifle": "Pulse Rifle",
                "scout_rifle": "Scout Rifle",
                "sidearm": "Sidearm",
                "shotgun": "Shotgun",
                "trace_rifle": "Trace Rifle",
                "bow": "Bow",
                "normal_grenade_launcher": "Grenade Launcher (Kinetic or Energy)",
                "power_grenade_launcher": "Grenade Launcher (Power)",
                "machine_gun": "Machine Gun",
                "sword": "Sword",
                "rocket_launcher": "Rocket Launcher",
                "solar": "Solar",
                "arc": "Arc",
                "void": "Void",
                "precision": "Precision",
                "melee": "Melee",
                "grenade": "Grenade",
                "super": "Super",
                "finisher": "Finisher",
                "cabal": "Cabal",
                "vex": "Vex",
                "fallen": "Fallen",
                "taken": "Taken",
                "scorn": "Scorn",
                "hive": "Hive",
            }
        }),
        methods: {
            formatName(rawName) {
                if (rawName in this.formattedNames) {
                    return this.formattedNames[rawName];
                }
                return rawName;
            }
        }
    }
</script>

<style scoped>

</style>