<template>
<v-app id="inspire">
    <v-navigation-drawer
        clipped
        class="grey lighten-4"
        app
        v-model="drawer">
        <v-list class="pt-0" flat>
            <template v-for="item in menu">
                <v-list-group
                    v-if="item.children"
                    :key="item.title"
                    :prepend-icon="item.icon"
                    :title="item.title">
                    <v-list-tile slot="activator">
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile
                        v-if="item.children"
                        v-for="subitem in item.children"
                        :key="subitem.title"
                        :to="subitem.to">
                        <v-list-tile-action>
                            <v-icon>{{ subitem.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ subitem.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>

                <v-list-tile v-if="!item.children" :key="item.title" :to="item.to" :title="item.title">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </template>
        </v-list>
    </v-navigation-drawer>
    <v-toolbar color="blue-grey" dark app absolute clipped-left>
        <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>
        <span class="title ml-3 mr-5"><span class="text">Uniqa!</span></span>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-menu offset-y close-on-click>
                <v-btn slot="activator" flat>
                    <v-avatar class="grey mr-2" size="32px">
                        <!-- <img src="../../images/user.png" alt="avatar"> -->
                    </v-avatar>
                    <span class="subheading"
                          style="text-transform: none;">
                        {{ user.username }}
                    </span>
                    <v-icon>arrow_drop_down</v-icon>
                </v-btn>
                <v-list dense>
                    <v-divider></v-divider>
                    <div>
                        <a href="/logout" class="list__tile list__tile--link" style="position: relative;">
                            <div class="list__tile__title text-md-center subheading"> logout </div>
                            <span class="ripple__container">
                                <span class="ripple__animation ripple__animation--visible" data-activated="1522379837402" style="width: 282px; height: 282px; transform: translate(-50%, -50%) translate(53px, 16px) scale3d(0.99, 0.99, 0.99);"></span>
                            </span>
                        </a>
                    </div>
                    <!-- <v-list-tile ripple to="/logout" @click.passive="">
                        <v-list-tile-title class="text-md-center subheading"> logout </v-list-tile-title>
                    </v-list-tile> -->
                </v-list>
            </v-menu>
        </v-toolbar-items>
    </v-toolbar>
    <v-content>
        <v-container fluid fill-height class="grey lighten-4">
            <v-layout justify-center align-center>
                <v-flex shrink>
                    <router-view></router-view>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</v-app>
</template>

<script>
import Vue from "vue";

export default {
    name: "App",
    data: () => ({
        drawer: null,
        user: {},
    }),
    computed: {
        menu() {
            let routes = this.$router.options.routes;

            let generateMenu = (path, routes) => {
                let menu_items = [];

                for (let i in routes) {
                    let route = routes[i];

                    // routes has menu
                    if (route.menu) {
                        let to = /^\//.test(route.path) ? route.path : "/"+ path +"/"+ route.path;
                        to = to.replace("//", "/");

                        let menu = route.menu;

                        if (route.children)
                            menu.children = generateMenu(to, route.children);

                        if (!menu.children || menu.children.length < 1) {
                            menu.children = null;
                            menu.to = to;
                        }

                        menu_items.push(menu);
                    }
                }

                return menu_items;
            };

            return generateMenu("/", routes);
        }
    },
    mounted() {
        Vue.http("/user/data")
            .then((res) => {
                this.user = res.data
            })
    },
}
</script>
