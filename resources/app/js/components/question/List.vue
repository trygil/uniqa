<template>
    <div class="px-4">
        <template v-for="(item, index) in data">
            <v-layout row pt-3>
                <v-flex xs2 text-xs-center>
                    <p class="display-1">{{ item.upvote }}</p>
                    <p class="body-2 grey--text darken-2">votes</p>
                </v-flex>
                <v-flex xs10>
                    <router-link :to="'/question/'+ item.id">
                        <p class="title">{{ item.title }}</p>
                    </router-link>
                    <p class="body-2 gray--text darken-3">
                        {{ item.post.length > 200 ? item.post.substring(0, 200)+"..." : item.post }}
                    </p>
                </v-flex>
            </v-layout>
            <hr v-if="index+1 < data.length" />
        </template>
    </div>
</template>

<script>
    export default {
        name: "Question",
        props: { data: Array },
    }
</script>
