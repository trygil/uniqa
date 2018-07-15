<template>
    <v-layout row>
        <v-flex md3 xs12>
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
        <v-flex md6 sm12>
            <v-flex px-4 v-if="search.query || search.tags.length > 0">
                <h3>{{ $t("question.labels.search_for", {query: search.query}) }}</h3>

                <v-divider></v-divider>
            </v-flex>

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

            <List v-show="!loading" :data="data" @refresh-list="loadQuestions()" /></List>
        </v-flex>
        <v-flex md3 xs12>
            <v-form style="position: fixed;">
                <div class="headline">
                    <v-icon>search</v-icon> 
                    {{ $t('question.labels.search') }}
                </div>
                <v-flex lg12>
                    <v-text-field
                        v-model="search.query"
                        :placeholder="$t('question.labels.search_query')">
                    </v-text-field>
                    <v-flex lg12>
                        <v-select
                            v-model="search.tags"
                            :label="$t('question.labels.search_tags')"
                            :search-input.sync="tag_search"
                            :items="tags"
                            autocomplete
                            cache-items
                            chips
                            tags></v-select>
                    </v-flex>
                </v-flex>
            </v-form>
        </v-flex>
    </v-layout>
</template>

<script>
    import Vue from "vue";
    import List from "./List";

    let search_timer = null;
    let tag_search_timer = null;

    export default {
        name: "Explore",
        components: { List },
        data() {
            return {
                loading: true,
                pagination: {},
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
                search: {query: null, tags: []},
                tag_search: {},
                tag_loading: false,
                tags: [],
            };
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
            },
            tag_search(val) {
                this.searchTag(val);
            },
            search: {
                deep: true,
                handler(val) {
                    let vm = this;
                    if (search_timer)
                        clearTimeout(search_timer);

                    search_timer = setTimeout(() => {
                        vm.loadQuestions(); // process search
                    }, 500);
                }
            }
        },
        methods: {
            loadQuestions(page) {
                this.loading = true;

                if (this.search.query)
                    this.$route.query.query = this.search.query;

                let search_tags = [];
                if (this.$route.query.tags)
                    search_tags = [this.$route.query.tags];

                if (this.search.tags.length > 0)
                    search_tags = this.search.tags;

                const route_params = this.$route.params;
                let params = {
                    perpage: 50,
                    page: page || 1,
                };

                if (this.search.query)
                    params.search = this.search.query;

                if (search_tags.length > 0)
                    params.tags = search_tags;

                let type = route_params.type || "recent";

                return Vue.http("/api/question/" + type, { params })
                    .then((res) => {
                        this.loading = false;
                        this.data = res.data;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
            searchTag(query) {
                this.tag_loading = true;

                let vm = this;
                if (tag_search_timer)
                    clearTimeout(tag_search_timer);

                let params = {
                    search: query,
                };

                tag_search_timer = setTimeout(async () => {
                    this.$http.get("/api/tag", { params })
                        .then((res) => {
                            vm.tags = res.data.tags.map((item) => item.tag);
                            vm.tag_loading = false;
                        })
                        .catch((e) => {
                            console.log(e)
                            vm.tag_loading = false;
                        });
                }, 500);
            },
        },
    }
</script>
