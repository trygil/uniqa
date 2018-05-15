import Vue from "vue";
import jwt_decode from "jwt-decode";
require("babel-regenerator-runtime");

const state = {
    user: {},
    token: null,
    refresh_token: null,
};

const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
    SET_TOKEN(state, token) {
        state.token = token;
    },
    SET_REFRESH_TOKEN(state, token) {
        state.refresh_token = token;
    },
    LOGOUT(state) {
        state.user = {};
        state.token = null;
        state.refresh_token = null;
    },
};

const actions = {
    async checkLoginToken({ commit }) {
        let auth_store = localStorage.getItem("auth");
        let token = localStorage.getItem("auth_token");
        let refresh_token = localStorage.getItem("auth_refresh_token");

        if (!auth_store || !token) return;

        let payload = JSON.parse(auth_store);
        commit("SET_USER", payload.user);
        commit("SET_TOKEN", token);
        commit("SET_REFRESH_TOKEN", refresh_token);

        Vue.http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    },

    async attemptLogin ({ commit }, credentials) {
        let form_data = "email=" + credentials.email + "&password=" + credentials.password;

        // Vue.http.options.emulateJSON = true;
        let response = await Vue.http.post("/login", form_data)
            .then((res) => {
                let token = res.data.token;
                let refresh_token = res.data.refreshToken;
                let payload = jwt_decode(token);

                let auth_store = {
                    token: token,
                    user: {
                        uid: payload.uid,
                        email: payload.data.email,
                        username: payload.data.username,
                    },
                    exp: payload.exp,
                };

                // insert payload to localStorage to be persistent
                localStorage.setItem("auth", JSON.stringify(auth_store));
                localStorage.setItem("auth_token", token);
                localStorage.setItem("auth_refresh_token", refresh_token);

                commit('SET_USER', payload.data);
                commit('SET_TOKEN', token);
                commit('SET_REFRESH_TOKEN', refresh_token);
            });

        return response;
    },

    attemptLogout ({ commit }) {
        commit('LOGOUT');

        // remove auth data from browser's localStorage
        localStorage.removeItem("auth");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_refresh_token");
    },
};

export default {
    state,
    mutations,
    actions,
}
