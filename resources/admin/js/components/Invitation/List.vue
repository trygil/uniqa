<template>
    <v-card>
        <v-card-title>
            <h2>Daftar Orang</h2>
            <v-btn color="primary" outline @click="addPerson">
                <v-icon>person_add</v-icon>
                {{ $t('action.add') }}
            </v-btn>

            <v-spacer></v-spacer>

            <v-select
                :items="filters"
                class="mt-4 mr-3"
                v-model="filter"
                label="Filter"
                item-text="label"
                item-value="value"
                return-object
                clearable>
            </v-select>

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
                    <span v-show="item.invited">{{ item.first_name }} {{ item.last_name }}</span>
                    <v-edit-dialog v-show="!item.invited" :return-value.sync="item.first_name">
                        {{ item.first_name }} {{ item.last_name }}
                        <v-text-field
                            slot="input"
                            label="First Name"
                            v-model="item.first_name"
                            single-line
                            @keyup.enter="edit(item)"></v-text-field>
                        <v-text-field
                            slot="input"
                            label="Last Name"
                            v-model="item.last_name"
                            single-line
                            @keyup.enter="edit(item)"></v-text-field>
                    </v-edit-dialog>
                </td>
                <td>
                    <span v-show="item.invited">{{ item.email }}</span>
                    <v-edit-dialog v-show="!item.invited" :return-value.sync="item.email">
                        {{ item.email }}
                        <v-text-field
                            slot="input"
                            label="Email"
                            v-model="item.email"
                            single-line
                            @keyup.enter="edit(item)"></v-text-field>
                    </v-edit-dialog>
                </td>
                <td>
                    <!-- user not invited -->
                    <v-tooltip bottom v-show="!item.invited">
                        <v-btn 
                            small 
                            icon 
                            slot="activator" 
                            @click="invite(item)" 
                            :loading="item.inviting"
                            :disabled="item.inviting">
                            <v-icon color="success">contact_mail</v-icon>
                        </v-btn>
                        <span>Undang!</span>
                    </v-tooltip>

                    <v-tooltip bottom v-show="!item.invited">
                        <v-btn 
                            small 
                            icon 
                            slot="activator" 
                            @click="deletePerson(item)" 
                            :loading="item.deleting"
                            :disabled="item.deleting">
                            <v-icon color="error">delete</v-icon>
                        </v-btn>
                        <span>Hapus</span>
                    </v-tooltip>
                    <!-- user not invited -->

                    <!-- user invited not registered -->
                    <v-tooltip bottom v-show="item.invited && !item.registered">
                        <v-icon slot="activator">done</v-icon>
                        <span>Undangan terkirim.</span>
                    </v-tooltip>

                    <v-tooltip bottom v-show="item.invited && !item.registered">
                        <v-btn 
                            small 
                            icon 
                            slot="activator" 
                            @click="cancel(item)" 
                            :loading="item.canceling"
                            :disabled="item.canceling">
                            <v-icon color="error">close</v-icon>
                        </v-btn>
                        <span>Batalkan undangan</span>
                    </v-tooltip>
                    <!-- user invited not registered -->

                    <!-- user invited registered -->
                    <!-- <v-tooltip bottom v-show="item.invited && item.registered">
                        <v-icon slot="activator">assignment_ind</v-icon>
                        <span>Jadikan moderator</span>
                    </v-tooltip>

                    <v-tooltip bottom v-show="item.invited && item.registered">
                        <v-btn 
                            small 
                            icon 
                            slot="activator" 
                            @click="block(item)" 
                            :loading="item.blocking"
                            :disabled="item.blocking">
                            <v-icon color="error">block</v-icon>
                        </v-btn>
                        <span>Blok pengguna</span>
                    </v-tooltip> -->
                    <!-- user invited registered -->
                </td>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                "{{ search }}" tidak ditemukan.
            </v-alert>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ form.id ? 'Edit' : 'Tambah' }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex md6>
                                <v-text-field label="Nama Awal" v-model="form.first_name"></v-text-field>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field label="Nama Akhir" v-model="form.last_name"></v-text-field>
                            </v-flex>
                            <v-flex md12>
                                <v-text-field label="Email" v-model="form.email"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn outline @click="closeDialog">Cancel</v-btn>
                    <v-btn color="blue darken-1" outline @click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import _ from "lodash";

let search_timer = null;

export default {
    name: "InvitationList",
    data() {
        return {
            headers: [
                { text: 'Nama', value: 'full_name', width: "30%" },
                { text: 'Email', value: "email", width: "20%" },
                { text: '#', value: null, sortable: false, width: "10%" },
            ],
            items: [],
            filter: null,
            filters: [
                // uninvited
                { value: 1, label: "Belum diundang" },
                // invited
                { value: 2, label: "Telah diundang" },
                // registered
                { value: 4, label: "Telah menjadi user" },
            ],
            search: "",
            pagination: {},
            totalItems: 0,
            items: [],
            loading: true,
            dialog: false,
            form: {},
        }
    },
    mounted () {
        this.loadData();
    },
    methods: {
        loadData() {
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

            return this.$http("/person/data", {params})
                .then((res) => {
                    let response = res.data;

                    this.items = response.data;
                    this.totalItems = parseInt(response.total);
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },

        invite(person) {
            let vm = this;
            this.$set(person, "inviting", true);

            this.$http
                .post("/invitation/invite", {id: person.id})
                .then(
                    () => {
                        vm.$message.success("Invitation has been sent successfully.");
                        this.$set(person, "inviting", false);
                        this.$set(person, "invited", true);
                    },
                    () => {
                        vm.$message.error("Failed to send invitation.");
                        this.$set(person, "inviting", false);
                        this.$set(person, "invited", false);
                    }
                )
        },

        cancel(person) {
            let vm = this;
            this.$set(person, "canceling", true);

            this.$http
                .post("/invitation/cancel", {id: person.id})
                .then(
                    () => {
                        vm.$message.success("Invitation has been canceled.");
                        this.$set(person, "canceling", false);
                        this.$set(person, "invited", false);
                    },
                    () => {
                        vm.$message.error("Failed to cancel invitation.");
                        this.$set(person, "canceling", false);
                    }
                )
        },

        addPerson() {
            this.dialog = true;
        },

        closeDialog() {
            this.form = {};
            this.dialog = false;
        },

        save() {
            const vm = this;

            this.$http
                .post("/person/add", {person: this.form})
                .then(
                    () => {
                        vm.$message.success("Data berhasil tersimpan.");
                        this.closeDialog();
                        this.search = "";
                        this.loadData();
                    },
                    () => {
                        vm.$message.error("Terjadi kesalahan ketika menyimpan data.");
                        this.closeDialog();
                    }
                );
        },

        edit(person) {
            const vm = this;
            this.$set(person, "editing", true);

            this.$http
                .post("/person/edit", {person: person})
                .then(
                    () => {
                        vm.$message.success("Data berhasil tersimpan.");
                        this.$set(person, "editing", false);
                    },
                    () => {
                        vm.$message.error("Terjadi kesalahan ketika akan menyimpan data.");
                        this.$set(person, "editing", false);
                    }
                )
        },

        deletePerson(person) {
            const vm = this;

            this.$confirm('Data akan terhapus secara permanen. Yakin?', 'Warning', {
                confirmButtonText: 'Yakin',
                cancelButtonText: 'Batal',
                type: 'warning'
            }).then(() => {
                this.$set(person, "deleting", true);
                this.$http
                    .get("/person/delete", {params: {id: person.id}})
                    .then(
                        () => {
                            vm.$message.success("Data telah terhapus.");
                            this.$set(person, "deleting", false);
                            this.loadData();
                        },
                        () => {
                            vm.$message.error("Terjadi kesalahan ketika menghapus data.");
                            this.$set(person, "deleting", false);
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
                this.loadData();
            },
            deep: true,
        },
        search() {
            let vm = this;
            if (search_timer)
                clearTimeout(search_timer);

            search_timer = setTimeout(() => {
                vm.loadData();
            }, 500);
        },
        filter() {
            this.loadData();
        },
    },
};
</script>
