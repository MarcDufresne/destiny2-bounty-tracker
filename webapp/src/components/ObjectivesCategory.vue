<template>
    <v-container fluid grid-list-md class="pt-1">
        <v-layout row wrap>
            <v-flex d-flex xs12 sm6 md4 lg3 xl2 v-for="(objective, index) in objectives" v-bind:key="index"
                    v-if="(objective.activity == null) || (selectedActivityFilters.includes(objective.activity) && showCompletedObjectives) || (selectedActivityFilters.includes(objective.activity) && !showCompletedObjectives && objective.progress < objective.completionValue)"
            >
                <Objective
                        :objective="objective"
                        :compact-mode="compactMode" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Objective from "./Objective";

    export default {
        name: "ObjectivesCategory",
        components: {Objective},
        props: ["objectives", "selectedActivityFilters", "showCompletedObjectives", "compactMode"]
    }
</script>

