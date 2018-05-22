<template>
    <v-layout row class="pa-2">
        <v-flex sm8>
            <div class="px-4">
                <h1 class="title">{{ data.title }}</h1> <hr />

                <Post :data="data" />

                <template v-if="data.posts.length > 0">
                    <h2 class="title mt-4">{{ data.posts.length }} Answers</h2>

                    <div v-for="item in data.posts">
                        <hr />
                        <Post :data="item" />
                    </div>
                </template>
            </div>
        </v-flex>

        <v-flex sm4 class="pl-4">
            <span class="title">Related</span>
        </v-flex>
    </v-layout>
</template>

<script>
    import Vue from "vue";
    import Post from "./Post";

    export default {
        name: "Detail",
        components: { Post },
        data() {
            return {
                loading: true,
                pagination: {},
                data: {},
            }
        },
        mounted() {
            this.loadQuestions();
        },
        methods: {
            loadQuestions() {
                this.loading = true;

                return Vue.http("/api/question/"+ this.$route.params.id)
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
