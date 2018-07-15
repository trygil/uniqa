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
                                <!-- Tags -->
                                <template v-if="item.data !== null">
                                    <router-link
                                        :to="'/questions/?tags=' + encodeURIComponent(tag)"
                                        class="pa-2 elevation-1 caption blue lighten-5"
                                        v-for="tag in item.data.tags">
                                        {{ tag }}
                                    </router-link>
                                </template>
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
                            <v-flex offset-xs2>
                                <v-btn round small outline 
                                    class="mx-0"
                                    color="primary"
                                    @click="openAnswer(item)">
                                    <v-icon>edit</v-icon> {{ $t('question.labels.submit_answer') }}
                                </v-btn>
                                <v-btn round small outline 
                                    class="mx-0" 
                                    color="grey darken-2" 
                                    v-if="item.user_id != user.id"
                                    @click="follow(item)">
                                    <v-icon>rss_feed</v-icon> 
                                    {{ item.followed ? 
                                        $t('question.labels.followed') : 
                                        $t('question.labels.follow') }}
                                </v-btn>
                            </v-flex>

                            <v-spacer></v-spacer>

                            <v-flex class="lg3">
                                <v-avatar size="36px" class="mr-2 teal">
                                    {{ (item.username || "").substr(0, 1) }}
                                </v-avatar>
                                <router-link :to="'/user/' + item.user_id">{{ item.username }}</router-link>
                                <br>
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

        <v-dialog
            v-model="answer_dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            scrollable>
            <v-card tile>
                <v-toolbar card dark color="success">
                    <v-btn icon dark @click.native="answer_dialog = false;form = {}">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ $t('question.labels.answer_question') }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat @click.prevent="answer()">
                            <v-icon>send</v-icon>
                            {{ $t('question.labels.submit_answer') }}
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <v-flex xs8 offset-xs2 v-if="form.post">
                        <span class="title">{{ form.post.title }}</span>
                        <p class="headline">{{ form.post.post }}</p>
                        <v-text-field
                            v-model="form.answer"
                            rows="2"
                            :label="$t('question.labels.answer')"
                            textarea
                            autofocus></v-text-field>
                    </v-flex>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-content v-show="data.length < 1">
            <v-container fluid fill-height class="grey lighten-4">
                <v-layout justify-center align-center>
                    <div class="flex xs12 text-xs-center grey--text">
                        <h3 class="display-1">Empty</h3>
                    </div>
                </v-layout>
            </v-container>
        </v-content>
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
                form: {},
                answering: false,
                answer_dialog: false,
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
            openAnswer(post) {
                this.answer_dialog = true;
                this.form.post = post;
            },
            async answer(post) {
                if (!/[\w\d]+/.test(this.form.post))
                    return;

                this.answering = true;

                let params = {
                    post_id: this.form.post.id,
                    title:   this.form.post.title,
                    post:    this.form.answer,
                    user_id: this.user.id,
                };

                let response = await this.$http.post("/question/answer", params)
                    .then((res) => {
                        this.answering = false;
                        this.answer_dialog = false;
                        this.form = {};
                        this.$message.success(this.$t("question.messages.answer_success"));
                    })
                    .catch((err) => {
                        this.$message.error(this.$t("question.messages.answer_failed"));
                    });
            },
            async follow(post) {
                let response = await this.$http.post("/question/follow/" + post.id)
                    .then((res) => {
                        post.followed = !!res.data;
                    })
                    .catch((err) => {
                        this.$message.error(this.$t("question.messages.action_failed"));
                    });
            },
        },
        watch: {
            answer_dialog(val) {
                // reset form value
                if (!val) this.form = {};
            },
        }
    }
</script>
