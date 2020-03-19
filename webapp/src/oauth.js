import {stringify} from "simple-query-string";

const OAUTH_LOGIN_URL = "https://www.bungie.net/en/OAuth/Authorize";
const OAUTH_TOKEN_URL = "https://www.bungie.net/platform/app/oauth/token/";
const OAUTH_CLIENT_ID = process.env.VUE_APP_OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.VUE_APP_OAUTH_CLIENT_SECRET;

export const OAuth = {
    getLoginUrl(state) {
        return `${OAUTH_LOGIN_URL}?client_id=${OAUTH_CLIENT_ID}&response_type=code&state=${state}`;
    },
    fetchTokenFromCode(code) {
        return fetch(OAUTH_TOKEN_URL, {
            method: 'POST',
            body: stringify({
                grant_type: 'authorization_code',
                code,
                client_id: OAUTH_CLIENT_ID,
                client_secret: OAUTH_CLIENT_SECRET,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Could not fetch token, ${response.status}`)
            })
            .then((data) => {
                if (data.access_token && data.refresh_token) {
                    console.log(data);
                    return data;
                }
                throw new Error(`No data found in response, ${data}`)
            });
    },
};