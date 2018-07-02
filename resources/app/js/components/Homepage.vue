<template>
    <v-layout row>
        <v-flex lg3 xs12>
            <v-layout fill-height>
                <v-list class="grow grey lighten-4">
                    <v-list-tile
                        v-for="(label, link) in links"
                        :key="link"
                        :to="link">
                        <v-list-tile-title v-text="label"></v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-layout>
        </v-flex>
        <v-flex lg6 xs12>
            <List :data="data" @refresh-list="loadQuestions()" />
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
                    "/questions/top": this.$t("question.menu.top_question"),
                    "/questions/recent": this.$t("question.menu.recent_question"),
                    "/questions/mostfollowed": this.$t("question.menu.most_followed_question"),
                },
            }
        },
        mounted() {
            this.loadQuestions();
            // this.loadTags();
        },
        methods: {
            loadQuestions() {
                this.loading = true;

                return Vue.http("/api/question/hot")
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
    