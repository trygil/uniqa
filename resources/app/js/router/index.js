import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

let routes = [
    {
        path: '/',
        component: require('../components/Feed').default,
        menu: {
            title: "Home",
            icon: "dashboard"
        }
    },
    {
        path: '/settings',
        menu: {
            title: "Settings",
            icon: "settings"
        },
    },
];

export default new Router({
    mode: "history",
    routes
})
