<template>
    <v-layout row>
        <v-flex sm8>
            <List :data="data" />
        </v-flex>
    </v-layout>
</template>

<script>
    import Vue from "vue";
    import List from "./question/List";

    export default {
        name: "Explore",
        components: { List },
        data() {
            return {
                loading: true,
                data: [],
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
