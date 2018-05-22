<template>
    <v-layout row wrap>
        <v-flex xs12 sm8>
            <v-tabs fixed-tabs v-model="tabs">
                <!-- tab list -->
                <v-tab v-for="item in items" :key="item">
                    {{ item }}
                </v-tab>
            </v-tabs>

            <!-- tab item -->
            <v-tabs-items v-model="tabs">
                <v-tab-item  v-for="item in items" :key="item" v-bind:id="item.id">
                    <!-- <v-card>
                        {{ item }}
                    </v-card> -->
                    <v-list three-line>
                        <template>
                            <!-- <v-subheader>Test</v-subheader>
                            <v-devider></v-devider> -->
                            <v-list-tile>
                                <!-- Avatar The Legend of Aang -->
                                <v-list-tile-avatar>
                                    <img src="uniqamente.png">
                                </v-list-tile-avatar>

                                <v-list-tile-content>
                                    <!-- Title -->
                                    <v-list-tile-title>Auto Debit 2018</v-list-tile-title>

                                    <!-- Content -->
                                    <v-list-tile-sub-title>
                                        <!-- Use for name -->
                                        <span class='text--primary'>Sandman Hakim</span> &mdash;

                                        <!-- Question -->
                                        Lorem ipsum dolor sit amet,
                                        consectetur adipiscing elit,
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>

                                <v-list-tile-action>
                                    123<br>
                                    <v-icon large color="blue darken-2">where_to_vote</v-icon>
                                </v-list-tile-action>

                                <v-list-tile-action>
                                    123<br>
                                    <v-icon large color="blue darken-2">chat</v-icon>
                                </v-list-tile-action>
                            </v-list-tile>
                        </template>
                    </v-list>
                </v-tab-item>
            </v-tabs-items>
        </v-flex>

        <v-flex xs12 sm4>
            <v-card-text>
                <h1 class="text-md-center">ADS</h1>
                <h1 class="text-md-center">GOES</h1>
                <h1 class="text-md-center">HERE</h1>
            </v-card-text>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    name: "Feed",
    data () {
        return {
            tabs: null,
            items: [
                'Newest', 'Featured', 'Auto Debit'
            ]
        }
    }
}
</script>
