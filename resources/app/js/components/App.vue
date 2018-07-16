<template>
<v-app id="inspire">
    <v-toolbar color="teal" dark app fixed clipped-left>
        <!-- <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon> -->
        <router-link to="/" class="title ml-3 mr-5">
            <v-avatar tile :size="50">
                <img src="/uniqamente.png" alt="avatar" />
            </v-avatar>
            <span class="text white--text">UNIQA</span>
        </router-link>

        <v-toolbar-items>
            <v-btn to="/questions" flat>
                <v-icon>language</v-icon> {{ $t("question.menu.explore") }}
            </v-btn>

            <v-btn to="/ask" flat v-show="user.username">
                <v-icon>question_answer</v-icon> {{ $t("question.menu.ask_question") }}
            </v-btn>
        </v-toolbar-items>

        <v-spacer></v-spacer>

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

            <v-menu offset-y left min-width="250" close-on-click v-show="user.username">
                <v-btn slot="activator" flat>
                    <v-icon>notifications</v-icon>
                </v-btn>

                <v-list class="pa-2">
                    <template v-for="(notif, id) in notifications">
                        <template v-for="(usernames, context) in notif.context">
                            <v-list-tile>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ notifActors(usernames) }}</v-list-tile-title>
                                    <v-list-tile-sub-title v-html="notifInfo(context, notif)"></v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                        </template>
                    </template>
                </v-list>
            </v-menu>

            <v-menu offset-y left close-on-click v-show="user.username">
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
                    <div>
                        <a href="/profile" @click.prevent="profile" class="list__tile list__tile--link" style="position: relative;">
                            <div class="list__tile__title text-md-left subheading">
                                <v-icon>person</v-icon> profile
                            </div>
                        </a>
                        <a href="/logout" @click.prevent="logout" class="list__tile list__tile--link" style="position: relative;">
                            <div class="list__tile__title text-md-left subheading">
                                <v-icon>exit_to_app</v-icon> logout
                            </div>
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
import Login from "./Login";

export default {
    name: "App",
    components: { Login },
    data: () => ({
        drawer: null,
        notify: null,
        notifications: {},
    }),
    methods: {
        logout() {
            this.$store.dispatch("attemptLogout");
            this.$router.push("/")
        },

        profile() {
            this.$router.push("/profile")
        },
        notifActors(actors) {
            let params = {others: 0};

            if (actors.length > 2)
                params.others = actors.length - 2;

            actors.map((actor, key) => {
                params[key] = actor;
            });

            return this.$tc("notification.actors", actors.length, params);
        },
        notifInfo(context, notif) {
            if (notif.is_answer)
                context += "_answer";

            return this.$t("notification." + context, {title: notif.title});
        },
    },
    computed: {
        user() {
            return this.$store.state.auth.user;
        }
    },
    mounted() {
        this.$http.interceptors.response.use(null, err => {
            if (err.response.status === 401) {
                this.$notify.error({
                    title: "Opps",
                    message: this.$t("auth.messages.session-expired"),
                    position: "bottom-right"
                });

                this.logout();
            }

            return Promise.reject(err);
        });
    },
    created() {
        let vm = this;

        vm.notify = this.$ws.connect().subscribe("notification:" + this.user.uid);

        vm.notify.on('ready', () => {
            vm.notify.emit('init', this.user.uid)
        })

        // all notifications arrive
        vm.notify.on('all', (data) => {
            let notifications = {};
            data.map((item) => {
                if (!notifications[item.post_id])
                    notifications[item.post_id] = {title: item.title, is_answer: item.is_answer, context: {}};

                if (!notifications[item.post_id].context[item.context])
                    notifications[item.post_id].context[item.context] = [];

                notifications[item.post_id].context[item.context].push(item.username);
            });

            this.notifications = notifications;
        })

        // new notification arrive
        vm.notify.on('new', (data) => {
            let notif = data[0];
            let notifications = Object.assign({}, this.notifications); // copy object

            // push new notification
            if (!notifications[notif.post_id])
                notifications[notif.post_id] = {title: notif.title, is_answer: notif.is_answer, context: {}};

            if (!notifications[notif.post_id].context[notif.context])
                notifications[notif.post_id].context[notif.context] = [];

            notifications[notif.post_id].context[notif.context].push(notif.username);

            // reassign notifications object
            this.notifications = notifications;
        });

        vm.notify.on('error', (error) => {
            console.error(error)
        })

        vm.notify.on('close', () => {
        })
    },
};
</script>
