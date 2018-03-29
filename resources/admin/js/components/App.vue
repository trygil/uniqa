<template>
<v-app id="inspire">
    <v-navigation-drawer
        fixed
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
    <v-toolbar color="amber" app absolute clipped-left>
        <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>
        <span class="title ml-3 mr-5">Bukan Google&nbsp;<span class="text">Keep! Uniqa!</span></span>
        <v-text-field
            solo-inverted
            flat
            label="Search"
            prepend-icon="search"></v-text-field>
        <v-spacer></v-spacer>
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
export default {
    name: "App",
    data: () => ({
        drawer: null,
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
                        let to = "/"+ route.path;
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
}
</script>
