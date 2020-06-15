<template>
    <div v-if="Object.keys(this.objectives).length > 0">
        <v-tabs
                fixed-tabs
                background-color="indigo"
                dark
                v-model="tab_model"
        >
            <v-tabs-slider></v-tabs-slider>
            <v-tab :href="`#${index}`" v-for="(objectives, char_name, index) in this.objectives"
                   v-bind:key="index">
                {{ char_name }}
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab_model">
            <v-tab-item
                    v-for="(objectives, char_name, index) in this.objectives"
                    :key="index"
                    :value="`${index}`"
            >
                <v-card flat>
                    <v-card-text class="pa-0">
                        <CharacterObjectives
                                :objectives="objectives"
                                :selectedActivityFilters="selectedActivityFilters"
                                :showCompletedObjectives="showCompletedObjectives"
                                :compactMode="compactMode"
                        />
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </div>
    <div v-else>
        <v-container>
            <v-row align="center" justify="center" class="pt-4">
                <v-progress-circular indeterminate color="indigo"></v-progress-circular>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import {Client} from "../client";
    import {LocalStorage, LOCAL_STORAGE_ACCESS_TOKEN_KEY} from "../utils";
    import CharacterObjectives from "./CharacterObjectives";

    export default {
        name: "Bounties",
        components: {CharacterObjectives},
        props: {
            accessToken: String,
            autoRefresh: Boolean,
            selectedActivityFilters: Array,
            showCompletedObjectives: Boolean,
            compactMode: Boolean,
        },
        data: () => ({
            tab_model: null,
            objectives: {},
        }),
        async mounted() {
            await this.getObjectives();
        },
        watch: {
            autoRefresh: function (newValue, _) {
                if (newValue) {
                    this.getObjectives();
                    this.autoRefreshRef = setInterval(this.interval, 5000);
                } else {
                    clearInterval(this.autoRefreshRef);
                }
            }
        },
        methods: {
            async getObjectives() {
                const accessToken = LocalStorage.getToken(LOCAL_STORAGE_ACCESS_TOKEN_KEY);

                const newObjectives = await Client.getObjectives(accessToken.token);
                if (newObjectives !== false) {
                    this.objectives = newObjectives;
                }
            },
            async interval() {
                await this.getObjectives();
            }
        }
    }
</script>

<style scoped>

</style>
