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
                            <v-menu v-show="item.user_id == user.id">
                                <v-btn slot="activator" icon>
                                    <v-icon>more_vert</v-icon>
                                </v-btn>
                                <v-list>
                                    <v-list-tile @click="deletePost(item.id)">
                                        <v-list-tile-title>
                                            {{ $t('action.delete') }}
                                        </v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </v-layout>

                        <v-card-title>
                            <v-spacer></v-spacer>

                            <v-avatar size="36px" class="mr-2 teal">
                                {{ (item.username || "").substr(0, 1) }}
                            </v-avatar>
                            <router-link :to="'/user/' + item.user_id">{{ item.username }}</router-link>
                        </v-card-title>
                    </v-card>
                </v-flex>
            </v-layout>
        </template>
    </div>
</template>

<script>
    export default {
        name: "Question",
        props: { data: Array },
        computed: {
            user() {
                return this.$store.state.auth.user;
            }
        },
        methods: {
            async deletePost(post_id) {
                // delete post
                let response = await this.$http.delete("/question/" + post_id)
                    .then(() => {
                        this.$emit("refresh-list");
                        this.$message.error(this.$t("question.messages.delete_success"));
                    })
                    .catch((err) => {
                        this.$message.error(this.$t("question.messages.action_failed"));
                    });
            },
        },
    }
</script>
