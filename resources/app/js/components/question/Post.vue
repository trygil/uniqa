<template>
    <v-layout row>
        <v-flex sm2 md1 text-xs-center>
            <p class="mb-0">
                <v-btn icon @click="upvote(1)">
                    <v-icon x-large>expand_less</v-icon>
                </v-btn>
            </p>
            <span class="title">{{ data.upvote }}</span>
            <p class="mb-0">
                <v-btn icon @click="upvote(-1)">
                    <v-icon x-large>expand_more</v-icon>
                </v-btn>
            </p>
        </v-flex>

        <v-flex xs10 pr-4>
            <div>
                <div v-html="data.post" />

                <v-layout row>
                    <!-- User-->
                    <v-flex lg6 offset-xs10 text-xs-center pa-3>
                        <v-btn 
                            v-if="!data.posts && posterid == user.id" 
                            title="choose as an answer"
                            @click="$emit('choosen', data)" 
                            icon>
                            <v-icon x-large :color="data.status ? 'success' : 'default'">check</v-icon>
                        </v-btn>
                        <v-chip>
                            <v-avatar class="teal">{{ (data.username || "").substr(0, 1) }}</v-avatar>
                            <router-link :to="'/user/' + data.user_id">{{ data.username }}</router-link>
                        </v-chip>
                        <br>
                        <span class="caption">
                            {{ $moment(data.created_at).fromNow() }}
                        </span>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <!-- Tags -->
                    <v-flex xs12 py-3 v-if="data.data">
                        <template v-if="data.data !== null">
                            <router-link
                                :to="'/questions/?tags=' + encodeURIComponent(tag)"
                                class="pa-2 elevation-1 caption blue lighten-5"
                                v-for="tag in data.data.tags"
                            >
                                {{ tag }}
                            </router-link>
                        </template>
                    </v-flex>
                </v-layout>
            </div>

            <!-- Comments -->
            <div class="px-3" v-if="data.comments.length > 0">
                <div v-for="comment in data.comments">
                    <hr class="my-1" />
                    <div class="caption">
                        {{ comment.comment }} -
                        <router-link :to="'/user/' + comment.user_id">{{ comment.username }}</router-link>
                    </div>
                </div>
                <hr class="my-1" />
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
    'use strict';

    export default {
        name: 'Post',
        props: { data: Object, posterid: Number },
        computed: {
            user() {
                return this.$store.state.auth.user;
            },
        },
        methods: {
            async upvote(val) {
                this.data.upvote += val;
                let range = Math.abs(this.data.upvoted - val);

                if (this.data.upvoted == val || range > 1)
                    this.data.upvoted = 0;
                else
                    this.data.upvoted = val;

                if (this.data.upvoted == 0)
                    this.data.upvote += val * (range > 1 ? 0 : -2);

                // value reset
                if (this.data.upvoted == 0)
                    val = 0;

                // send upvote
                let response = await this.$http.post("/question/upvote/" + this.data.id, { val })
                    .then((res) => {
                        console.log(res)
                        this.data.upvote = res.data;
                    })
                    .catch((err) => {
                        this.$message.error(this.$t("question.messages.action_failed"));
                    });
            },
        },
    }
</script>
