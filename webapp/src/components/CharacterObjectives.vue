<template>
    <v-container fluid>
        <v-row>
            <v-container class="pa-0" v-for="objectiveId in pinnedObjectiveIDs" v-bind:key="objectiveId">

            </v-container>
            <v-container v-for="(category_objectives, category_name) in objectives"
                         v-bind:key="category_name"
                         class="pa-0"
            >
                <div v-if="countShownObjectives(category_objectives) > 0">
                    <v-container fluid grid-list-md class="pa-0" v-if="compactMode">
                        <v-layout row wrap>
                            <v-col cols="1" class="pr-0">
                                <span>{{ formatName(category_name) }}</span>
                            </v-col>
                            <v-col cols="11" class="pl-1">
                                <ObjectivesCategory
                                        :objectives="category_objectives"
                                        :selectedActivityFilters="selectedActivityFilters"
                                        :showCompletedObjectives="showCompletedObjectives"
                                        :compactMode="compactMode"
                                />
                            </v-col>
                        </v-layout>
                    </v-container>
                    <v-container class="pa-0" v-else>
                        <h3>{{ formatName(category_name) }}</h3>
                        <ObjectivesCategory
                                :objectives="category_objectives"
                                :selectedActivityFilters="selectedActivityFilters"
                                :showCompletedObjectives="showCompletedObjectives"
                                :compactMode="compactMode"
                        />
                    </v-container>
                </div>
            </v-container>
        </v-row>
    </v-container>
</template>

<script>
    import ObjectivesCategory from "./ObjectivesCategory";
    import {OBJECTIVE_TYPES_FORMAT} from "../formatting";

    export default {
        name: "CharacterObjectives",
        components: {ObjectivesCategory},
        props: ["objectives", "selectedActivityFilters", "showCompletedObjectives", "compactMode"],
        data: () => ({
            formattedNames: OBJECTIVE_TYPES_FORMAT,
            pinnedObjectiveIDs: []
        }),
        methods: {
            formatName(rawName) {
                if (rawName in this.formattedNames) {
                    return this.formattedNames[rawName];
                }
                return rawName;
            },
            countShownObjectives(categoryObjectives) {
                let count = 0;
                for (const objIndex in categoryObjectives) {
                    const objective = categoryObjectives[objIndex];
                    if ((objective.activity == null)
                        || (this.selectedActivityFilters.includes(objective.activity) && this.showCompletedObjectives)
                        || (this.selectedActivityFilters.includes(objective.activity) && !this.showCompletedObjectives && objective.progress < objective.completionValue)
                    ) {
                        count += 1;
                    }
                }
                return count;
            },
        }
    }
</script>

<style scoped>

</style>
