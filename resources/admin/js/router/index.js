import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

let routes = [
    {
        path: '/',
        component: require('../components/Dashboard').default,
        menu: {
            title: "Home",
            icon: "dashboard"
        }
    },
    {
        path: '/invitation',
        component: require('../components/Invitation/List').default,
        menu: {
            title: "User Invitation",
            icon: "users"
        },
    },
];

export default new Router({
    mode: "history",
    routes
})
