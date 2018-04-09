<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            :pagination.sync="pagination"
            :total-items="totalItems"
            :loading="loading"
            class="elevation-1"
        >
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
                        <span>Invite!</span>
                    </v-tooltip>
                    <v-tooltip bottom v-show="item.invited">
                        <v-icon slot="activator">done</v-icon>
                        <span>Invite Sent!</span>
                    </v-tooltip>

                    <v-tooltip bottom v-show="item.invited">
                        <v-btn 
                            small 
                            icon 
                            slot="activator" 
                            @click="cancel(item)" 
                            :loading="item.canceling"
                            :disabled="item.canceling">
                            <v-icon color="error">close</v-icon>
                        </v-btn>
                        <span>Cancel invitation</span>
                    </v-tooltip>
                </td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import Vue from "vue";

export default {
    name: "InvitationList",
    data() {
        return {
            headers: [
                { text: 'Name', value: 'full_name' },
                { text: 'Email', value: "email" },
                { text: '#', value: null, sortable: false },
            ],
            items: [],
            search: "",
            pagination: {},
            totalItems: 0,
            items: [],
            loading: true,
        }
    },
    watch: {
        pagination: {
            handler () {
                this.loadData();
            },
            deep: true
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

            return Vue.http("/person/data", {params})
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

            Vue.http
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

            Vue.http
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

        edit(person) {
            const vm = this;
            this.$set(person, "editing", true);

            Vue.http
                .post("/person/edit", {person: person})
                .then(
                    () => {
                        vm.$message.success("Data successfully edited.");
                    },
                    () => {
                        vm.$message.error("Failed to edit person data.");
                        this.$set(person, "editing", false);
                    }
                )
        },
    },
};
</script>
