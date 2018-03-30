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
                    <v-btn icon small>
                        <v-icon>edit</v-icon>
                    </v-btn>
                     <v-tooltip bottom>
                        <v-btn small icon slot="activator">
                            <v-icon color="success">contact_mail</v-icon>
                        </v-btn>
                        <span>Invite!</span>
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
                { text: '#', value: null },
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
            Vue.http("/person/data")
                .then((res) => {
                    let response = res.data;

                    this.items = response.data;
                    this.totalItems = parseInt(response.total);
                })
        },
    },
};
</script>