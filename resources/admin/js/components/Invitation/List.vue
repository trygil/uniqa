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
                <td>{{ item.first_name }} {{ item.last_name }}</td>
                <td>{{ item.email }}</td>
                <td>
                    <!-- <v-btn icon small>
                        <v-icon>edit</v-icon>
                    </v-btn> -->
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
        }
    },
};
</script>
