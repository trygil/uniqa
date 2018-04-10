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
            icon: "person_add"
        },
    },
    {
        path: '/settings',
        component: require('../components/Settings/Layout').default,
        children: [
            {
                path: 'profile',
                component: require('../components/Settings/Profile').default,
                menu: {
                    title: "Profile",
                    icon: "person"
                },
            },
            {
                path: 'change-password',
                component: require('../components/Settings/ChangePassword').default,
                menu: {
                    title: "Change password",
                    icon: "lock"
                },
            },
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
