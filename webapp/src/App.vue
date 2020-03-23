<template>
    <v-app id="app">

        <v-app-bar
                app
                clipped-left
        >
            <v-toolbar-title>Destiny 2 Bounty Tracker</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn v-if="devMode" icon>
                <v-icon v-on:click="findUnmappedObjectives()">mdi-clock</v-icon>
            </v-btn>
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
                            <v-row class="pl-4 mb-4">
                                <v-btn class="mr-2" v-on:click="this.selectAllActivities">Select All Activities</v-btn>
                                <v-btn class="mr-2" v-on:click="this.clearAllActivities">Clear All Activities</v-btn>
                                <v-btn class="mr-2" v-on:click="this.selectAllDestinations">Select All Destinations</v-btn>
                                <v-btn class="mr-2" v-on:click="this.clearAllDestinations">Clear All Destinations</v-btn>
                            </v-row>
                            <v-row>
                                <div class="pl-4"><small>Activities:</small></div>
                                <div
                                        v-for="(value, propertyName) in activityTypes"
                                        :key="value"
                                >
                                    <v-checkbox v-model="selectedActivityFilters" class="ml-3 my-0"
                                                :label="formatName(value)" :value="value" height="10px"></v-checkbox>
                                </div>
                            </v-row>
                            <v-row>
                                <div class="pl-4"><small>Destinations:</small></div>
                                <div
                                        v-for="(value, propertyName) in destinationTypes"
                                        :key="value"
                                >
                                    <v-checkbox v-model="selectedActivityFilters" class="ml-3 my-0"
                                                :label="formatName(value)" :value="value" height="10px"></v-checkbox>
                                </div>
                            </v-row>
                            <v-row>
                                <div>
                                    <v-checkbox v-model="showCompletedObjectives" class="ml-3 my-0"
                                                label="Show Completed Objectives" height="10px"></v-checkbox>
                                </div>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-row>
            <div v-if="loggedIn">
                <Characters
                        :auto-refresh="autoRefresh"
                        :selectedActivityFilters="selectedActivityFilters"
                        :showCompletedObjectives="showCompletedObjectives"
                />
            </div>
            <div v-else>
                <v-row align="center" justify="center">
                    <v-btn dark large class="my-4" v-on:click="clickLogin">Login</v-btn>
                </v-row>
            </div>
        </v-content>

        <v-footer app padless>
            <v-col
                    class="text-center pa-0 ma-0"
                    cols="12"
            >
                <small class="pa-0 ma-0 grey--text">
                    &copy; {{ new Date().getFullYear() }} — <strong>MarcDufresne</strong> — <a
                        href="https://github.com/MarcDufresne/destiny2-bounty-tracker-web/issues/new"> Feedback</a>
                </small>
            </v-col>
        </v-footer>
    </v-app>
</template>

<script>
    import {v4 as uuid} from 'uuid';
    import moment from 'moment';
    import {DevUtils} from "./devUtils";
    import {OAuth} from './oauth';
    import {LOCAL_STORAGE_ACCESS_TOKEN_KEY, LOCAL_STORAGE_REFRESH_TOKEN_KEY, LocalStorage} from "./utils";
    import {ActivityType, DestinationType} from "./models";
    import Characters from './components/Characters';
    import {ACTIVITY_TYPES_FORMAT} from "./formatting";

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
            showCompletedObjectives: true,
            formattedNames: ACTIVITY_TYPES_FORMAT,
            devMode: process.env.NODE_ENV === "development"
        }),
        created() {
            this.$vuetify.theme.dark = true;
        },
        mounted() {
            this.processLogin();
            this.loggedIn = this.isLoggedIn();
            this.selectAllActivities();
            this.selectAllDestinations();
            this.loggedInInterval();
        },
        methods: {
            selectAllActivities() {
                const valActivities = Object.values(this.activityTypes);
                for (const itemIndex in valActivities) {
                    this.selectedActivityFilters.push(valActivities[itemIndex]);
                }
            },
            clearAllActivities() {
                const valActivities = Object.values(this.activityTypes);
                this.selectedActivityFilters = this.selectedActivityFilters.filter(val => !valActivities.includes(val));
            },
            selectAllDestinations() {
                const valDestinations = Object.values(this.destinationTypes);
                for (const itemIndex in valDestinations) {
                    this.selectedActivityFilters.push(valDestinations[itemIndex]);
                }
            },
            clearAllDestinations() {
                const valDestinations = Object.values(this.destinationTypes);
                this.selectedActivityFilters = this.selectedActivityFilters.filter(val => !valDestinations.includes(val));
            },
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
            loggedInInterval() {
                setInterval(this.isLoggedIn, 5000);
            },
            isLoggedIn() {
                if (process.env.NODE_ENV === "development") {
                    console.log("Checking auth status...")
                }
                const refreshToken = LocalStorage.getToken(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
                const accessToken = LocalStorage.getToken(LOCAL_STORAGE_ACCESS_TOKEN_KEY);

                if (accessToken) {
                    if (moment(accessToken.expires).isAfter()) {
                        return true;
                    } else {
                        if (refreshToken) {
                            if (moment(refreshToken.expires).isAfter()) {
                                this.refreshAccessToken(refreshToken.token);
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }
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
                        this.handleTokenResp(result);
                    });
                }
            },
            refreshAccessToken(refreshToken) {
                OAuth.fetchTokenFromRefreshToken(refreshToken).then((result) => {
                    this.handleTokenResp(result);
                });
            },
            handleTokenResp(data) {
                window.history.pushState("", "", '/');
                const accessExpiresAt = moment().add(data.expires_in, "seconds");
                const refreshExpiresAt = moment().add(data.refresh_expires_in, "seconds");
                LocalStorage.saveToken(LOCAL_STORAGE_ACCESS_TOKEN_KEY, {
                    token: data.access_token,
                    expires: accessExpiresAt.format()
                });
                LocalStorage.saveToken(LOCAL_STORAGE_REFRESH_TOKEN_KEY, {
                    token: data.refresh_token,
                    expires: refreshExpiresAt.format()
                });
                this.loggedIn = this.isLoggedIn();
            },
            findUnmappedObjectives() {
                DevUtils.findUnmappedObjectives();
            }
        }
    };
</script>
