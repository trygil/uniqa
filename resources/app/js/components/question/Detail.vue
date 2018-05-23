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
                        <Post :data="item" @choosen="changeStatus" />
                    </div>
                </template>

                <template v-show="user.id && post.user_id != user.id">
                    <v-flex lg10 offset-lg1>
                        <v-form @submit.prevent="answer">
                            <v-text-field
                                v-model="form.post"
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
                answering: false,
                pagination: {},
                form: {},
                data: {
                    data: {},
                    comments: [],
                    posts: [],
                },
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
            changeStatus(post) {
                // reseting posts status
                this.data.posts.map((post) => {
                    post.status = 0;
                });

                post.status = !post.status;
            },
        },
    }
</script>
