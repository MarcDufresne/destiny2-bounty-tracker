import moment from "moment";

export const Time = {
    isAfter(timeString) {
        return moment(timeString).isAfter(moment());
    },
    formatTime(timeString) {
        return moment(timeString).fromNow();
    }
};

export const LOCAL_STORAGE_ACCESS_TOKEN_KEY = "accessToken";
export const LOCAL_STORAGE_REFRESH_TOKEN_KEY = "refreshToken";

export const LocalStorage = {
    saveToken(key, token) {
        localStorage.setItem(key, JSON.stringify(token));
    },
    getToken(key) {
        const rawToken = localStorage.getItem(key);
        return rawToken ? JSON.parse(rawToken) : null;
    },
};