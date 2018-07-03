<template>
     <v-card>
        <v-card-title>
            <h2>Post Report</h2>

            <v-spacer></v-spacer>

            <v-text-field
                append-icon="search"
                label="Cari.."
                single-line
                hide-details
                v-model="search"></v-text-field>
        </v-card-title>

        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            :pagination.sync="pagination"
            :total-items="totalItems"
            :loading="loading"
            class="elevation-5">
            <template slot="items" slot-scope="{item}">
                <td>
                    <span>{{ item.title }}</span>
                </td>
                <td>
                    <span>{{ item.username }}</span>
                </td>
                <td>
                    <span>{{ item.post_type }}</span>
                </td>
                <td>
                    <span>{{ item.report_count }} kali</span>
                </td>
                <td>
                    <v-tooltip bottom>
                        <v-btn 
                            small 
                            icon 
                            slot="activator" 
                            @click="deletePost(item)" 
                            :loading="item.deleting"
                            :disabled="item.deleting">
                            <v-icon color="error">close</v-icon>
                        </v-btn>
                        <span>Hapus</span>
                    </v-tooltip>
                </td>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                "{{ search }}" tidak ditemukan.
            </v-alert>
        </v-data-table>
    </v-card>
</template>

<script>
export default {
    name: "Dashboard",
    data() {
        return {
            headers: [
                { text: 'Judul', value: 'title', width: "30%" },
                { text: 'Diposting oleh', value: 'username', width: "25%" },
                { text: 'Jenis post', value: 'post_type', width: "25%" },
                { text: 'Dilaporkan sebanyak', value: "report_count", width: "20%" },
                { text: '#', value: null, sortable: false, width: "10%" },
            ],
            search: null,
            pagination: {},
            items: [],
        };
    },
    methods: {
        loadReports() {
            this.loading = true;
            let params = {
                asc: !this.pagination.descending,
                page: this.pagination.page,
                perpage: this.pagination.rowsPerPage,
                sortby: this.pagination.sortBy,
            };

            if (this.search)
                params.search = this.search;

            if (this.filter)
                params.filter = this.filter.value;

            return this.$http("/reports", {params})
                .then((res) => {
                    let response = res.data;

                    this.items = response.data;

                    this.items.map((item) => {
                        item.post_type = item.parent_id ? "Jawaban" : "Pertanyaan";
                        return item;
                    });

                    this.totalItems = parseInt(response.total);
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        deletePost(post) {
            const vm = this;

            this.$confirm('Data akan terhapus secara permanen. Yakin?', 'Warning', {
                confirmButtonText: 'Yakin',
                cancelButtonText: 'Batal',
                type: 'warning'
            }).then(() => {
                this.$set(post, "deleting", true);
                this.$http
                    .delete("/post/" + post.id)
                    .then(
                        () => {
                            vm.$message.success("Post telah terhapus.");
                            this.$set(post, "deleting", false);
                            this.loadReports();
                        },
                        () => {
                            vm.$message.error("Terjadi kesalahan ketika menghapus data.");
                            this.$set(post, "deleting", false);
                        }
                    )
            }).catch(() => {
                this.$message.info("Hapus dibatalkan");
            });
        },
    },
    watch:{
        pagination: {
            handler() {
                this.loadReports();
            },
            deep: true,
        },
        search() {
            let vm = this;
            if (search_timer)
                clearTimeout(search_timer);

            search_timer = setTimeout(() => {
                vm.loadReports();
            }, 500);
        },
        filter() {
            this.loadReports();
        },
    },
}
</script>