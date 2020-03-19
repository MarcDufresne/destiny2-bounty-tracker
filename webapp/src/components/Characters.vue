<template>
    <div>
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
                    <v-card-text>
                        <ObjectivesList :objectives="objectives"/>
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
    import {Client} from "../client";
    import {LocalStorage, LOCAL_STORAGE_ACCESS_TOKEN_KEY} from "../utils";
    import ObjectivesList from "./ObjectivesList";

    export default {
        name: "Bounties",
        components: {ObjectivesList},
        props: {
            accessToken: String
        },
        data: () => ({
            tab_model: null,
            objectives: []
        }),
        async mounted() {
            this.getObjectives();
        },
        created() {
            setInterval(this.interval, 5000);
        },
        destroyed() {
            clearInterval(this.interval);
        },
        methods: {
            async getObjectives() {
                const accessToken = LocalStorage.getToken(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
                const resp = await Client.getObjectives(accessToken.token);
                this.objectives = resp;
            },
            async interval() {
                await this.getObjectives();
            }
        }
    }
</script>

<style scoped>

</style>