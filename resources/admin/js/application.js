import Vue from 'vue'
import Vuetify from 'vuetify'
import {
    Row,
    Col,
    Form,
    Input,
    FormItem,
    Button
} from 'element-ui'
import axios from 'axios'
import el_locale from 'element-ui/lib/locale/lang/en'
import App from "./components/App"
import store from './store'
import router from './router'
import i18n from "./lang"

Vue.use(Vuetify)
Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Button)

Vue.prototype.$ELEMENT = {locale: el_locale};
Vue.http = Vue.prototype.$http = axios;

let app = new Vue({
    el: "#app",
    components: { App },
    template: "<App />",
    store,
    router,
    i18n,
});
