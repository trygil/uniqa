<template>
    <v-layout row>
        <v-flex sm2 md1 text-xs-center>
            <p class="mb-0"><v-icon x-large>expand_less</v-icon></p>
            <span class="title">{{ data.upvote }}</span>
            <p class="mb-0"><v-icon x-large>expand_more</v-icon></p>
        </v-flex>

        <v-flex xs10 pr-4>
            <div>
                <div v-html="data.post" />

                <v-layout row>
                    <!-- Tags -->
                    <v-flex xs6 py-3>
                        <template v-if="data.data !== null">
                            <router-link
                                :to="'/tags/' + encodeURIComponent(tag.tag)"
                                class="pa-2 elevation-1 caption blue lighten-5"
                                v-for="tag in data.data.tags"
                            >
                                {{ tag.tag }}
                            </router-link>
                        </template>
                    </v-flex>

                    <!-- User-->
                    <v-flex xs6 offset-xs6 text-xs-right pa-3>
                        <v-chip>
                            <v-avatar class="teal">A</v-avatar>
                            <router-link :to="'/user/' + data.user_id">{{ data.username }}</router-link>
                        </v-chip>
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
        props: { data: Object },
        computed: {
            user() {
                return this.$store.state.auth.user;
            },
        },
    }
</script>
