<template>
    <div class="px-4">
        <template v-for="(item, index) in data">
            <v-layout row pb-3>
                <v-flex xs12>
                    <v-card>
                        <v-layout row pt-3 spacer>
                            <v-flex xs2 text-xs-center>
                                <p class="display-1">{{ item.upvote }}</p>
                                <p class="body-2 grey--text darken-2">votes</p>
                            </v-flex>
                            <v-flex xs8>
                                <router-link :to="'/question/'+ item.id">
                                    <p class="title">{{ item.title }}</p>
                                </router-link>
                                <p class="body-2 gray--text darken-3">
                                    {{ item.post.length > 200 ? item.post.substring(0, 200)+" ... " : item.post }}
                                    <router-link 
                                        v-if="item.post.length > 200" 
                                        :to="'/question/'+ item.id">
                                        {{ $t("action.more") }}
                                    </router-link>
                                </p>
                            </v-flex>
                            <v-spacer></v-spacer>

                            <v-menu>
                                <v-btn slot="activator" icon>
                                    <v-icon>more_vert</v-icon>
                                </v-btn>
                                <v-list>
                                    <v-list-tile 
                                        @click="deletePost(item.id)"
                                        v-show="item.user_id == user.id">
                                        <v-list-tile-title class="body-1">
                                            <v-icon>close</v-icon>
                                            {{ $t('action.delete') }}
                                        </v-list-tile-title>
                                    </v-list-tile>
                                    <v-list-tile 
                                        @click="showReportPost(item)"
                                        v-show="item.user_id != user.id">
                                        <v-list-tile-title class="body-1">
                                            <v-icon>report</v-icon>
                                            {{ $t('action.report') }}
                                        </v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </v-layout>

                        <v-card-title>
                            <v-spacer></v-spacer>

                            <v-flex class="lg3">
                                <v-avatar size="36px" class="mr-2 teal">
                                    {{ (item.username || "").substr(0, 1) }}
                                </v-avatar>
                                <router-link :to="'/user/' + item.user_id">{{ item.username }}</router-link>

                                <span class="caption ml-5 mt-2">
                                    {{ $moment(item.created_at).fromNow() }}
                                </span>
                            </v-flex>

                        </v-card-title>
                    </v-card>
                </v-flex>

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
            </v-layout>
        </template>
    </div>
</template>

<script>
    export default {
        name: "Question",
        props: { data: Array },
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
            }
        },
        methods: {
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

            async deletePost(post_id) {
                this.$confirm(this.$t('question.labels.delete_confirmation'), 'Warning', {
                    confirmButtonText: this.$t('action.sure'),
                    cancelButtonText: this.$t('action.cancel'),
                    type: 'warning'
                }).then(async () => {
                    // delete post
                    let response = await this.$http.delete("/question/" + post_id)
                        .then(() => {
                            this.$emit("refresh-list");
                            this.$message.success(this.$t("question.messages.delete_success"));
                        })
                        .catch((err) => {
                            this.$message.error(this.$t("question.messages.action_failed"));
                        });
                });
            },
        },
    }
</script>
