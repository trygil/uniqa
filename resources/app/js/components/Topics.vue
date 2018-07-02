<template>
    <v-layout fill-height>
        <v-list class="grow pa-2 grey lighten-5">
            <h2 style="border-bottom: 1px solid #999;"> Topics </h2>
            <v-list-tile
                v-for="topic in topics"
                :key="topic"
                @click="">
                <v-list-tile-title>
                    {{ topic }}
                </v-list-tile-title>
            </v-list-tile>
        </v-list>
    </v-layout>
</template>

<script>
export default {
    name: "Topics",
    data() {
        return {
            topics: [
                "Students",
                "Administration",
                "Computer Science",
            ],
        };
    },
}
</script>