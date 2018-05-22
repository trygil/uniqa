<template>
<v-app id="inspire">
    <v-toolbar color="blue-grey lighten-5" app absolute clipped-left>
        <!-- <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon> -->
        <span class="title ml-3 mr-5">
             <v-avatar tile :size="50">
                  <img src="/uniqamente.png" alt="avatar">
                </v-avatar>
            <span class="text">Uniqa!</span>
        </span>

        <v-toolbar-items>
            <v-btn to="/" flat>
                <v-icon>language</v-icon> {{ $t("question.menu.explore") }}
            </v-btn>

            <v-btn to="/ask" flat v-show="user.username">
                <v-icon>question_answer</v-icon> {{ $t("question.menu.ask_question") }}
            </v-btn>

        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-text-field
            solo-inverted
            flat
            class="mr-3"
            label="search.."
            prepend-icon="search"></v-text-field>
        <v-toolbar-items>
            <v-menu
                v-show="!user.username"
                offset-y
                :close-on-content-click="false">
                <v-btn slot="activator" :ripple="false" flat>
                    Login
                </v-btn>
                <Login v-show="!user.username"></Login>
            </v-menu>
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
                        <a href="/profile" @click.prevent="profile" class="list__tile list__tile--link" style="position: relative;">
                            <div class="list__tile__title text-md-center subheading"> profile </div>
                        </a>
                    </div>

                    <div>
                        <a href="/logout" @click.prevent="logout" class="list__tile list__tile--link" style="position: relative;">
                            <div class="list__tile__title text-md-center subheading"> logout </div>
                            <!-- <span class="ripple__container">
                                <span class="ripple__animation ripple__animation--visible" data-activated="1522379837402" style="width: 282px; height: 282px; transform: translate(-50%, -50%) translate(53px, 16px) scale3d(0.99, 0.99, 0.99);"></span>
                            </span> -->
                        </a>
                    </div>
                </v-list>
            </v-menu>
        </v-toolbar-items>
    </v-toolbar>
    <v-content>
        <v-container fluid fill-height class="grey lighten-4">
            <v-layout justify-center align-center>
                <router-view></router-view>
            </v-layout>
        </v-container>
    </v-content>
</v-app>
</template>

<script>
import Login from "./Login"

export default {
    name: "App",
    components: { Login },
    data: () => ({
        drawer: null,
    }),
    methods: {
        logout() {
            this.$store.dispatch("attemptLogout");
            this.$router.push("/")
        },

        profile() {
            this.$router.push("/profile")
        },
    },
    computed: {
        user() { return this.$store.state.auth.user; }
    },
    mounted() {
        this.$http.interceptors.response.use(null, (err) => {
            if(err.response.status === 401) {
                this.$notify.error({
                    title: 'Opps',
                    message: this.$t("auth.messages.session-expired"),
                    position: 'bottom-right',
                });

                this.logout()
            }

            return Promise.reject(err);
        });
    },
}
</script>
