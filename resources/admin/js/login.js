import Vue from 'vue'
import Element from 'element-ui'
import axios from 'axios'
import el_locale from 'element-ui/lib/locale/lang/en'
// import i18n from "./lang"

Vue.use(Element, {locale: el_locale});
Vue.http = Vue.prototype.$http = axios;

let app = new Vue({
    el: "#login",
});
