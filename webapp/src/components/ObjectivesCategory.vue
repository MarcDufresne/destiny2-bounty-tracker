<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex d-flex xs12 sm6 md4 lg3 xl2 v-for="(objective, index) in objectives" v-bind:key="index">
                <v-card width="100%" elevation="4">
                    <v-list-item>
                        <v-list-item-avatar tile size="54">
                            <v-img :src="`https://bungie.net${objective.iconLink}`"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title class="headline" :title="objective.bounty.name">
                                <small>{{ objective.bounty.name }}</small>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <small>{{ formatName(objective.activity) }}</small>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-text>
                        <p class="desc" :title="objective.bounty.description">
                            <small>{{ objective.bounty.description }}</small>
                        </p>
                        <p>
                            <small v-if="isAfter(objective.bounty.expiration)">
                                <span>Expires {{ formatTime(objective.bounty.expiration) }}</span>
                            </small>
                            <small v-else>
                                <span class="red--text">Expired {{ formatTime(objective.bounty.expiration) }}</span>
                            </small>
                        </p>
                        <p class="mb-0">
                            <small>
                                <span class="d2-font" v-if="hasSymbol(objective.progressDescription)">
                                    {{ mapSymbol(objective.progressDescription) }}
                                </span>
                                {{ cleanProgressDescription(objective.progressDescription) }}
                            </small>
                            <v-progress-linear
                                    height="20"
                                    :value="(objective.progress / objective.completionValue) * 100"
                                    :color='objective.completed ? "yellow darken-3" : "green"'
                            >
                                <template v-slot="{ value }">
                                    {{ objective.progress }}/{{ objective.completionValue }}
                                </template>
                            </v-progress-linear>
                        </p>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {Time} from "../utils"

    export default {
        name: "ObjectivesCategory",
        props: ["objectives"],
        data: () => ({
            formattedNames: {
                "global": "Global",
                "strikes": "Strikes",
                "crucible": "Crucible",
                "gambit": "Gambit",
                "seasonal": "Seasonal",
                "playlist": "Playlist",
                "edz": "EDZ",
                "mars": "Mars",
                "io": "IO",
                "titan": "Titan",
                "mercury": "Mercury",
                "moon": "Moon",
                "tangled_shore": "Tangled Shore",
                "dreaming_city": "Dreaming City",
                "nessus": "Nessus"
            },
            symbolMap: {
                "Bow": "",
                "Auto Rifle": "",
                "Pulse Rifle": "",
                "Scout Rifle": "",
                "Hand Cannon": "",
                "Shotgun": "",
                "Sniper Rifle": "",
                "Fusion Rifle": "",
                "Submachine Gun": "",
                "SMG": "",
                "Rocket Launcher": "",
                "Sidearm": "",
                "Grenade Launcher": "",
                "Power Grenade Launcher": "",
                "Trace Rifle": "",
                "Linear Fusion Rifle": "",
                "Sword": "",
                "Machine Gun": "",
                "Kinetic Grenade Launcher": "",
                "Kinetic": "",
                "Precision": "",
                "Headshot": "",
                "Solar": "",
                "Arc": "",
                "Void": "",
                "Grenade": "",
                "Melee": "",
            }
        }),
        methods: {
            formatTime(timeString) {
                return Time.formatTime(timeString);
            },
            isAfter(timeString) {
                return Time.isAfter(timeString);
            },
            formatName(rawName) {
                if (rawName in this.formattedNames) {
                    return this.formattedNames[rawName];
                }
                return rawName;
            },
            substringProgressDescription(description) {
                return description.substring(
                    description.lastIndexOf("[") + 1,
                    description.lastIndexOf("]")
                );
            },
            hasSymbol(description) {
                const subDesc = this.substringProgressDescription(description);
                return subDesc in this.symbolMap;
            },
            mapSymbol(description) {
                const subDesc = this.substringProgressDescription(description);
                if (subDesc in this.symbolMap) {
                    return this.symbolMap[subDesc];
                }
                return ""
            },
            cleanProgressDescription(description) {
                const subDesc = this.substringProgressDescription(description);
                if (subDesc in this.symbolMap) {
                    return description.replace(/\[.*]/, "");
                }
                return description;
            }
        }
    }
</script>

<style scoped>
    .desc {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        height: 3em;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* number of lines to show */
    }
</style>