<template>
    <v-app id="app">

        <v-app-bar
                app
                clipped-left
        >
            <v-toolbar-title>Objectives</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn v-if="loggedIn" icon>
                <v-icon v-if="autoRefresh" v-on:click="toggleAutoRefresh" title="Pause Auto-Refresh">pause</v-icon>
                <v-icon v-else v-on:click="toggleAutoRefresh" title="Enable Auto-Refresh">loop</v-icon>
            </v-btn>
            <v-btn v-if="loggedIn" icon>
                <v-icon v-on:click="logout">input</v-icon>
            </v-btn>
        </v-app-bar>

        <v-content>
            <v-row v-if="loggedIn" align="center" justify="center">
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-header>Filters</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row>
                                <div
                                        v-for="(value, propertyName) in activityTypes"
                                        :key="value"
                                >
                                    <v-checkbox v-model="selectedActivityFilters" class="mx-3"
                                                :label="formatName(value)" :value="value"></v-checkbox>
                                </div>
                            </v-row>
                            <v-row>
                                <div
                                        v-for="(value, propertyName) in destinationTypes"
                                        :key="value"
                                >
                                    <v-checkbox v-model="selectedActivityFilters" class="mx-3"
                                                :label="formatName(value)" :value="value"></v-checkbox>
                                </div>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-row>
            <div v-if="loggedIn">
                <Characters :auto-refresh="autoRefresh" :selectedActivityFilters="selectedActivityFilters"/>
            </div>
            <div v-else>
                <v-row align="center" justify="center">
                    <v-btn dark large class="my-4" v-on:click="clickLogin">Login</v-btn>
                </v-row>
            </div>
        </v-content>

        <v-footer app>
            <span>&copy; 2019</span>
        </v-footer>
    </v-app>
</template>

<script>
    import {v4 as uuid} from 'uuid';
    import moment from 'moment';
    import {OAuth} from './oauth';
    import {LocalStorage, LOCAL_STORAGE_ACCESS_TOKEN_KEY, LOCAL_STORAGE_REFRESH_TOKEN_KEY} from "./utils";
    import {ActivityType, DestinationType} from "./models";
    import Characters from './components/Characters';

    const LOCAL_STORAGE_STATE_KEY = "oauthState";

    export default {
        name: 'App',

        props: {
            source: String,
        },

        components: {
            Characters,
        },

        data: () => ({
            drawer: null,
            loggedIn: false,
            autoRefresh: false,
            activityTypes: ActivityType,
            destinationTypes: DestinationType,
            selectedActivityFilters: [],
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
        }),

        created() {
            this.$vuetify.theme.dark = true;
        },
        mounted() {
            this.processLogin();
            this.loggedIn = this.isLoggedIn();
            const valActivities = Object.values(this.activityTypes);
            for (const itemIndex in valActivities) {
                this.selectedActivityFilters.push(valActivities[itemIndex]);
            }
            const valDestinations = Object.values(this.destinationTypes);
            for (const itemIndex in valDestinations) {
                this.selectedActivityFilters.push(valDestinations[itemIndex]);
            }
            console.log(this.selectedActivityFilters);
        },
        methods: {
            toggleAutoRefresh() {
                this.autoRefresh = !this.autoRefresh;
                this.selectedActivityFilters.push("crucible");
            },
            formatName(rawName) {
                if (rawName in this.formattedNames) {
                    return this.formattedNames[rawName];
                }
                return rawName;
            },
            logout() {
                localStorage.clear();
                window.location.replace("/");
            },
            isLoggedIn() {
                const refreshToken = LocalStorage.getToken(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
                const accessToken = LocalStorage.getToken(LOCAL_STORAGE_ACCESS_TOKEN_KEY);

                if (accessToken) {
                    if (moment(accessToken.expires).isAfter()) {
                        return true;
                    } else {
                        this.clickLogin();
                    }
                }
                // Get an access token from the refresh token?
                return false;
            },
            clickLogin() {
                const state = uuid();
                localStorage.setItem(LOCAL_STORAGE_STATE_KEY, state);
                window.location.replace(OAuth.getLoginUrl(state));
            },
            processLogin() {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has("state") && urlParams.has("code")) {
                    // Get access and refresh tokens
                    const state = urlParams.get("state");
                    const code = urlParams.get("code");
                    const localState = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);

                    if (localState !== state) {
                        console.log("Wrong or missing state");
                        localStorage.removeItem(LOCAL_STORAGE_STATE_KEY);
                        return;
                    }

                    OAuth.fetchTokenFromCode(code).then((result) => {
                        console.log(result);
                        window.history.pushState("", "", '/');
                        const accessExpiresAt = moment().add(result.expires_in, "seconds");
                        const refreshExpiresAt = moment().add(result.refresh_expires_in, "seconds");
                        LocalStorage.saveToken(LOCAL_STORAGE_ACCESS_TOKEN_KEY, {
                            token: result.access_token,
                            expires: accessExpiresAt.format()
                        });
                        LocalStorage.saveToken(LOCAL_STORAGE_REFRESH_TOKEN_KEY, {
                            token: result.refresh_token,
                            expires: refreshExpiresAt.format()
                        });
                        this.loggedIn = this.isLoggedIn();
                    });
                }
            }
        }
    };
</script>
