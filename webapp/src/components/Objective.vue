<template>
    <v-hover v-slot:default="{ hover }">
        <v-card
                width="100%"
                elevation="4"
                v-on:click="$emit('pinObjective', objective.objectiveId)"
                :class="{ 'on-hover': hover }">
            <div :class="{'pinned': pins}"></div>
            <v-list-item class="pa-0"
                         :title="objective.bounty.name + '\n' + objective.bounty.description + '\n' + compactDateFormat(objective.bounty.expiration)">
                <v-list-item-avatar tile size="48" class="my-0 mb-1">
                    <v-img :src="`https://bungie.net${objective.iconLink}`"></v-img>
                </v-list-item-avatar>
                <v-list-item-content class="py-0">
                    <v-list-item-title class="small-headline mb-0">
                        <small>
                            <v-icon class="red--text expiration-icon-fix" v-if="!isAfter(objective.bounty.expiration)">
                                mdi-clock-outline
                            </v-icon>
                            {{ objective.bounty.name }}
                        </small>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <small>
                        <span
                                v-if="objective.activity == null"
                                class="font-weight-bold"
                                title="Unmapped Objective, click to send feedback"
                        >
                            <a :href="unmappedObjectiveFeedbackLink(objective)" class="red--text"
                               style="text-decoration: none">
                                Unmapped
                            </a>
                        </span>
                            {{ formatName(objective.activity) }}
                        </small>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-card-text class="pa-0">
                <v-progress-linear
                        height="20"
                        :value="(objective.progress / objective.completionValue) * 100"
                        :color='objective.progress >= objective.completionValue ? "yellow darken-3" : "green"'
                >
                    <template v-slot="{ value }">
                        <v-row>
                            <v-col cols="6" class="py-0 pr-2 pl-4">
                                <small class="overflow-hidden">
                                            <span class="d2-font" v-if="hasSymbol(objective.progressDescription)">
                                                {{ mapSymbol(objective.progressDescription) }}
                                            </span>
                                    {{ cleanProgressDescription(objective.progressDescription) }}
                                </small>
                            </v-col>
                            <v-col cols="6" class="py-0 pl-2 pr-4">
                                <div class="text-right overflow-hidden">
                                    <small>
                                        {{ objective.progress }} / {{ objective.completionValue }}
                                    </small>
                                </div>
                            </v-col>
                        </v-row>
                    </template>
                </v-progress-linear>

                <span class="hidden" title="Objective ID">{{ objective.objectiveId }}</span>
            </v-card-text>
        </v-card>
    </v-hover>
</template>
<script>
    import {Time} from "../utils";
    import {ACTIVITY_TYPES_FORMAT, PROGRESS_DESC_SYMBOLS} from "../formatting";

    export default {
        name: 'Objective',
        props: {
            objective: {},
            pins: false
        },
        data: () => ({
            formattedNames: ACTIVITY_TYPES_FORMAT,
            symbolMap: PROGRESS_DESC_SYMBOLS,
        }),
        methods: {
            cleanProgressDescription(description) {
                const subDesc = this.substringProgressDescription(description);
                if (subDesc in this.symbolMap) {
                    return description.replace(/\[.*]/, "");
                }
                return description;
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
            isAfter(timeString) {
                return Time.isAfter(timeString);
            },
            dateFormat(timeString) {
                return Time.dateFormat(timeString);
            },
            compactDateFormat(timeString) {
                const prefix = Time.isAfter(timeString) ? "Expires" : "Expired";
                const formattedDate = this.formatTime(timeString);
                return `${prefix} ${formattedDate}`;
            },
            formatName(rawName) {
                if (rawName in this.formattedNames) {
                    return this.formattedNames[rawName];
                }
                return rawName;
            },
            formatTime(timeString) {
                return Time.formatTime(timeString);
            },
            unmappedObjectiveFeedbackLink(objective) {
                let link = "https://github.com/MarcDufresne/destiny2-bounty-tracker-web/issues/new?";
                link += "title=Unmapped%20Objective%20" + objective.objectiveId;
                link += "&body=%2A%2AObj%20ID%2A%2A:%20" + objective.objectiveId;
                link += "%0A%2A%2ABounty%20ID%2A%2A:%20" + objective.bounty.bountyId;
                link += "%0A%2A%2ABounty%20Name%2A%2A:%20" + objective.bounty.name;
                link += "%0A%2A%2ABounty%20Desc%2A%2A:%20" + objective.bounty.description;
                link += "%0A%2A%2AProgress%20Desc%2A%2A:%20" + objective.progressDescription;
                link += "%0A%2A%2AIcon%2A%2A:%20https://bungie.net" + objective.iconLink;
                link += "&labels=UnmappedObjective";
                return link;
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

    .overflow-hidden {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        height: 1.6em;
    }

    .small-headline {
        font-size: 1.0rem;
    }

    .hidden {
        display: none;
    }

    .expiration-icon-fix {
        font-size: 90% !important;
        position: relative !important;
        top: -0.1em !important;
    }

    .v-card .on-hover {
        background-color: #343434;
    }

    .pinned {
        position: absolute;
        left: calc(100% - 16px);
        top: 0;
        width: 16px;
        height: 16px;
        float: end;
        clip-path: polygon(100% 0, 0 0, 100% 100%);
        background-color: #32a852;
    }
</style>
