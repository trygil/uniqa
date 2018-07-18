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
                    <v-menu v-if="user.id">
                        <v-btn slot="activator" icon style="float: right;">
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                        <v-list>
                            <v-list-tile 
                                @click="deletePost(data)"
                                v-show="data.user_id == user.id">
                                <v-list-tile-title class="body-1">
                                    <v-icon>close</v-icon>
                                    {{ $t('action.delete') }}
                                </v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile 
                                @click="showReportPost(data)"
                                v-show="data.user_id != user.id">
                                <v-list-tile-title class="body-1">
                                    <v-icon>report</v-icon>
                                    {{ $t('action.report') }}
                                </v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>

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
            <el-dialog
                title=""
                :visible.sync="report.show"
                width="40%"
                center>
                <span>
                    <!-- show this if logged user not yet report this post -->
                    <v-flex v-show="!report.post.reported" lg12 v-for="(reason, index) in reasons">
                        <el-radio 
                            v-model="report.i_reason"
                            :label="index">
                            {{ reason }}
                        </el-radio>
                        <el-input 
                            v-if="index + 1 == reasons.length" 
                            v-show="report.i_reason == reasons.length - 1"
                            v-model="report.reason">
                        </el-input>
                    </v-flex>
                    <!-- show this if logged user not yet report this post -->

                    <!-- show this if logged user already report this post -->
                    <v-flex v-show="report.post.reported" lg12>
                        Reported for <i>"{{ report.post.reported }}"</i>
                    </v-flex>
                    <!-- show this if logged user already report this post -->
                </span>

                <span slot="footer" class="dialog-footer" v-show="!report.post.reported">
                    <el-button @click="cancelReportPost()">{{ $t('action.cancel') }}</el-button>
                    <el-button type="primary" @click="reportPost()">{{ $t('action.report') }}</el-button>
                </span>
                <span slot="footer" class="dialog-footer" v-show="report.post.reported">
                    <el-button @click="cancelReportPost()">Ok</el-button>
                </span>
            </el-dialog>
        </v-flex>
    </v-layout>
</template>

<script>
    'use strict';

    export default {
        name: 'Post',
        props: { data: Object, posterid: Number },
        data() {
            return {
                report: {
                    post: {},
                    reason: null,
                    show: false,
                    i_reason: null,
                },
                reasons: [
                    "Uncivil, unneighborly or offensive",
                    "Not relevant or annoying",
                    "Safety issue or illegal", 
                    "Commercial or spam", 
                    "Others",
                ],
            };
        },
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
                        this.data.upvote = res.data;
                    })
                    .catch((err) => {
                        this.$message.error(this.$t("question.messages.action_failed"));
                    });
            },
            showReportPost(post) {
                this.report.show = true;
                this.report.i_reason = null;
                this.report.reason = null;
                this.report.post = post;
            },
            cancelReportPost(post_id) {
                this.report.show = false;

                // just delay the states change
                setTimeout(() => {
                    this.report.post = {};
                    this.report.i_reason = null;
                    this.report.reason = null;
                }, 500);
            },
            async reportPost() {
                let params = {
                    post_id: this.report.post.id,
                    reason: this.report.reason,
                };

                if (this.report.i_reason < this.reasons.length -1) 
                    params.reason = this.reasons[this.report.i_reason];

                // delete post
                let response = await this.$http.post("/question/report", params)
                    .then(() => {
                        this.$emit("refresh-list");

                        this.report.post.reported = this.report.reason;
                        this.$message.success(this.$t("question.messages.report_success"));

                        // reset all
                        this.cancelReportPost()
                    })
                    .catch((err) => {
                        this.$message.error(this.$t("question.messages.action_failed"));
                        // reset all
                        this.cancelReportPost()
                    });
            },
            async deletePost(post) {
                this.$confirm(this.$t('question.labels.delete_confirmation'), 'Warning', {
                    confirmButtonText: this.$t('action.sure'),
                    cancelButtonText: this.$t('action.cancel'),
                    type: 'warning'
                }).then(async () => {
                    // delete post
                    let response = await this.$http.delete("/question/" + post.id)
                        .then(() => {
                            if (post.parent_id) {
                                this.$emit("refresh-question");
                                this.$message.success(this.$t("question.messages.delete_answer_success"));
                            } else {
                                this.$router.push("/");
                                this.$message.success(this.$t("question.messages.delete_success"));
                            }

                        })
                        .catch((err) => {
                            this.$message.error(this.$t("question.messages.action_failed"));
                        });
                });
            },
        },
    }
</script>
