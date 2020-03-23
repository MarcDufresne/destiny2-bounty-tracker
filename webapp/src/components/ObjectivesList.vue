<template>
    <v-container fluid>
        <v-row>
            <v-container v-for="(category_objectives, category_name) in objectives"
                         v-bind:key="category_name"
                         class="pt-1 pb-0"
            >
                <h3>{{ formatName(category_name) }}</h3>
                <ObjectivesCategory
                        :objectives="category_objectives"
                        :selectedActivityFilters="selectedActivityFilters"
                        :showCompletedObjectives="showCompletedObjectives"
                />
            </v-container>
        </v-row>
    </v-container>
</template>

<script>
    import ObjectivesCategory from "./ObjectivesCategory";
    import {OBJECTIVE_TYPES_FORMAT} from "../formatting";

    export default {
        name: "ObjectivesList",
        components: {ObjectivesCategory},
        props: ["objectives", "selectedActivityFilters", "showCompletedObjectives"],
        data: () => ({
            formattedNames: OBJECTIVE_TYPES_FORMAT
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