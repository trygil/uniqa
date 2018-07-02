<template>
    <v-layout row>
        <v-flex md3 xs12>
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
        <v-flex md6>
            <List :data="data" @refresh-list="loadQuestions()" />

            <!-- <div class="text-xs-center mt-5" v-if="pagination.lastPage > 1">
                <v-pagination :length="pagination.lastPage" v-model="pagination.page" @input="loadQuestions" />
            </div> -->
        </v-flex>
    </v-layout>
</template>

<script>
    import Vue from "vue";
    import List from "./List";

    export default {
        name: "Explore",
        components: { List },
        data() {
            return {
                loading: true,
                pagination: {},
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
        },
        watch: {
            "$route.params": {
                deep: true,
                handler() {
                    // re-load questions
                    this.loadQuestions()
                },
            }
        },
        methods: {
            loadQuestions(page) {
                this.loading = true;

                const route_params = this.$route.params;
                const params = {
                    perpage: 10,
                    page: page || 1,
                    tags: this.$route.query.tags,
                };

                let type = route_params.type || "recent";

                return Vue.http("/api/question/" + type, { params })
                    .then((res) => {
                        this.loading = false;
                        this.data = res.data;
                        /*this.pagination = {
                            total: parseInt(response.total),
                            perPage: parseInt(response.perPage),
                            page: parseInt(response.page),
                            lastPage: parseInt(response.lastPage),
                        };*/
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
        },
    }
</script>
