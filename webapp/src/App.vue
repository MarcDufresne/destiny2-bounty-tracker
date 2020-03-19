<template>
    <v-app id="app">

        <v-app-bar
                app
                clipped-left
        >
            <v-toolbar-title>Objectives</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon v-on:click="logout">input</v-icon>
            </v-btn>
        </v-app-bar>

        <v-content>
            <div v-if="this.loggedIn">
                <Characters />
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
        }),

        created() {
            this.$vuetify.theme.dark = true;
        },
        mounted() {
            this.processLogin();
            this.loggedIn = this.isLoggedIn();
        },
        methods: {
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
                const path = window.location.pathname;
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has("state") && urlParams.has("code") && path === "/callback") {
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
