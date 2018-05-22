import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router);

let routes = [
    {
        path: '/',
        component: require('../components/Homepage').default,
    },
    {
        path: '/question/:id',
        component: require('../components/question/Detail').default,
    },
    {
        path: '/question',
        component: require('../components/question/Explore').default,
    },
    {
        path: '/ask',
        component: require('../components/FormQuestion').default,
        beforeEnter(to, from, next) {
            // check login token
            store.dispatch("checkLoginToken");

            // if user not defined
            if (!store.state.auth.token)
                return

            next();
        }
    },
    {
        path: '/settings',
    },
];

export default new Router({
    mode: "history",
    routes
})
