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
        path: '/invitation',
        component: require('../components/Invitation/List').default,
        menu: {
            title: "User Invitation",
            icon: "person_add"
        },
    },
    {
        path: '/settings',
        children: [
            {
                path: 'administrator',
                component: require('../components/Invitation/List').default,
                menu: {
                    title: "Administrators",
                    icon: "person_add"
                },
            }
        ],
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
