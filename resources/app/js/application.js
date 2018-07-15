import Vue from 'vue'
import Vuetify from 'vuetify'
import {
    Row,
    Col,
    Form,
    Input,
    FormItem,
    Button,
    Message,
    Alert,
    Notification,
    Dialog,
    Radio,
    RadioGroup,
    MessageBox,
} from 'element-ui'
import axios from 'axios'
import el_locale from 'element-ui/lib/locale/lang/en'
import App from "./components/App"
import store from './store'
import router from './router'
import i18n from "./lang"
import jwt_decode from "jwt-decode";
import moment from "moment";
import ws from '@adonisjs/websocket-client';

Vue.use(Vuetify)
Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Alert)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)

moment.locale('id');

Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
Vue.prototype.$ELEMENT = {locale: el_locale};
Vue.http = Vue.prototype.$http = axios;
Vue.prototype.$moment = moment;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$ws = ws(null, {});

// check login token
store.dispatch("checkLoginToken");

function refreshToken() {
    let refresh_token = localStorage.getItem("auth_refresh_token");

    Vue.http.get("/checkauth", {params: {refresh_token}})
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

            store.commit('SET_USER', payload.data);
            store.commit('SET_TOKEN', token);
            store.commit('SET_REFRESH_TOKEN', refresh_token);

            Vue.http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            setTimeout(refreshToken, 60 * 1000);
        });
}

if (store.state.auth.token) {
    setTimeout(refreshToken, 1.5 * 1000);
}


let app = new Vue({
    el: "#app",
    components: { App },
    template: "<App />",
    store,
    router,
    i18n,
});
