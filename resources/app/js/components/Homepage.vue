<template>
    <v-layout row>
        <v-flex lg3 xs12>
            <v-layout fill-height style="position: fixed">
                <v-list class="grow grey lighten-4">
                    <v-list-tile
                        v-for="(item, link) in links"
                        :key="link"
                        :to="link">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content v-text="item.label"></v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-layout>
        </v-flex>
        <v-flex lg6 xs12>
            <v-content v-show="loading">
                <v-container fluid fill-height class="grey lighten-4">
                    <v-layout justify-center align-center>
                        <v-progress-circular 
                            :size="70" 
                            :width="7" 
                            indeterminate 
                            color="primary"></v-progress-circular>
                    </v-layout>
                </v-container>
            </v-content>

            <List v-show="!loading" :data="data" @refresh-list="loadQuestions(1)" />
        </v-flex>
        <v-flex lg3 xs12>
            <Topics></Topics>
        </v-flex>
    </v-layout>
</template>

<script>
    import Vue from "vue";
    import List from "./question/List";
    import Topics from "./Topics";

    export default {
        name: "Explore",
        components: { List, Topics },
        data() {
            return {
                loading: true,
                data: [],
                links: {
                    "/questions/top": {
                        label: this.$t("question.menu.top_question"),
                        icon: "thumb_up",
                    },
                    "/questions/recent": {
                        label: this.$t("question.menu.recent_question"),
                        icon: "watch_later",
                    },
                },
            }
        },
        mounted() {
            this.loadQuestions();
        },
        methods: {
            loadQuestions(page) {
                this.loading = true;

                const params = {
                    perpage: 50,
                    page: page || 1,
                };

                return Vue.http("/api/question/recent", { params })
                    .then((res) => {
                        this.loading = false;
                        this.data = res.data;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
        },
    }
</script>
    