<template>
    <v-layout row>
        <v-flex sm8>
            <List :data="data" @refresh-list="loadQuestions()" />

            <div class="text-xs-center mt-5" v-if="pagination.lastPage > 1">
                <v-pagination :length="pagination.lastPage" v-model="pagination.page" @input="loadQuestions" />
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
    import Vue from "vue";
    import List from "./List";

    export default {
        name: "Explore",
        components: { List },
        data() {
            return {
                loading: true,
                pagination: {},
                data: [],
            }
        },
        mounted() {
            this.loadQuestions();
        },
        methods: {
            loadQuestions(page) {
                this.loading = true;

                const params = {
                    perpage: 10,
                    page: page || 1,
                };

                return Vue.http("/api/question", { params })
                    .then((res) => {
                        const response = res.data;

                        this.loading = false;
                        this.data = response.data;
                        this.pagination = {
                            total: parseInt(response.total),
                            perPage: parseInt(response.perPage),
                            page: parseInt(response.page),
                            lastPage: parseInt(response.lastPage),
                        };
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
        },
    }
</script>
