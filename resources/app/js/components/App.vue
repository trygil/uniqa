<template>
<v-app id="inspire">
    <!-- <v-navigation-drawer
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
    </v-navigation-drawer> -->
    <v-toolbar color="blue-grey lighten-5" app absolute clipped-left>
        <!-- <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon> -->
        <span class="title ml-3 mr-5">
             <v-avatar tile :size="50">
                  <img src="/uniqamente.png" alt="avatar">
                </v-avatar>
            <span class="text">Uniqa!</span>
        </span>

        <v-toolbar-items>
            <v-btn to="/ask" flat>
                <v-icon>language</v-icon> Explore!
            </v-btn>

            <v-btn to="/ask" flat>
                <v-icon>question_answer</v-icon> Ask Question
            </v-btn>
            
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-text-field
            solo-inverted
            flat
            label="Search"
            prepend-icon="search"></v-text-field>
        <v-toolbar-items>
            <v-btn flat offset-y v-show="!user.username">
                Login
            </v-btn>
            <v-menu offset-y close-on-click v-show="user.username">
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
    mounted() {
        Vue.http("/user/data")
            .then((res) => {
                this.user = res.data
            });
    },
}
</script>
