<template>
    <v-layout row class="pa-2">
        <v-flex sm6 offset-sm2>
            <div class="px-4">
                <h1 class="title">{{ data.title }}</h1> <hr />

                <Post :data="data" />

                <template v-if="data.posts && data.posts.length > 0">
                    <h2 class="title mt-4">{{ data.posts.length }} Answers</h2>

                    <div v-for="item in data.posts">
                        <hr />
                        <Post :posterid="data.user_id" :data="item" @choosen="changeStatus" />
                    </div>
                </template>

                <template>
                    <v-flex lg10 offset-lg1 v-show="user.id">
                        <v-form @submit.prevent="answer">
                            <v-text-field
                                v-model="form.post"
                                autofocus
                                :label="$t('question.labels.answer')"
                                textarea></v-text-field>
                            <v-btn 
                                type="submit" 
                                size="large" 
                                color="primary"
                                outline 
                                :loading="answering">
                                {{ $t('question.labels.submit_answer') }}
                            </v-btn>
                        </v-form>
                    </v-flex>
                </template>
            </div>
        </v-flex>

        <v-flex sm4 class="pl-4" v-show="related_posts.length > 0">
            <span class="title">Related</span>
            <v-list class="grow pa-2 grey lighten-5">
                <v-list-tile
                    v-for="related in related_posts"
                    :key="related.id">
                    <router-link :to="'/question/' + related.id" class="blue--text">
                        {{ related.title }}
                    </router-link>
                </v-list-tile>
            </v-list>
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
                answering: false,
                pagination: {},
                form: {},
                data: {
                    data: {},
                    comments: [],
                    posts: [],
                },
                related_posts: [],
            }
        },
        computed: {
            user() {
                return this.$store.state.auth.user;
            },
        },
        mounted() {
            this.loadQuestions();
        },
        watch: {
            "$route.params.id": {
                handler() {
                    this.loadQuestions();
                }
            }
        },
        methods: {
            loadQuestions() {
                this.loading = true;

                this.related_posts = [];

                this.$http("/api/question/"+ this.$route.params.id)
                    .then((res) => {
                        this.loading = false;
                        this.data = res.data;
                    })
                    .catch(() => {
                        this.loading = false;
                    });

                this.$http.get('/api/question/related/' + this.$route.params.id)
                    .then((res) => {
                        this.related_posts = res.data;
                    });
            },
            async answer() {
                if (!/[\w\d]+/.test(this.form.post))
                    return;

                this.answering = true;
                this.form.post_id = this.data.id;
                this.form.title = this.data.title;
                this.form.user_id = this.user.id;

                let response = await this.$http.post("/question/answer", this.form)
                    .then((res) => {
                        this.answering = false;
                        this.form = {};
                        this.loadQuestions();
                        this.$message.success(this.$t("question.messages.answer_success"));
                    })
                    .catch((err) => {
                        this.$message.error(this.$t("question.messages.answer_failed"));
                    });
            },
            async changeStatus(post) {
                // reseting posts status
                this.data.posts.map((post) => {
                    post.status = 0;
                });

                // toggle status
                post.status = post.status == 1 ? 0 : 1;

                // change answer
                let response = await this.$http.post("/question/choose/" + this.data.id, { 
                    id: post.id
                })
                    .then((res) => {
                        post.status = this.data.status = res.data;
                    })
                    .catch((err) => {
                        post.status = this.data.status = err.response.data;
                        this.$message.error(this.$t("question.messages.action_failed"));
                    });
            },
        },
    }
</script>
