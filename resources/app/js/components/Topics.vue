<template>
    <v-layout fill-height>
        <v-list class="grow pa-2 grey lighten-5">
            <h2 style="border-bottom: 1px solid #999;"> Topics </h2>
            <v-list-tile
                v-for="tag in tags"
                :key="tag.tag"
                :to="'/questions/?tags=' + encodeURIComponent(tag.tag)"
                @click="">
                <v-list-tile-title>
                    {{ tag.tag }}
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
            tags: [],
            total: 0,
        };
    },
    methods: {
        async loadTags() {
            // retrieve popular tags
            let response = await this.$http.get("/api/tag")
                .then((res) => {
                    this.tags = res.data.tags;
                    this.total = res.data.total;
                })
                .catch((err) => {
                })
        },
    },
    mounted() {
        this.loadTags();
    },
}
</script>