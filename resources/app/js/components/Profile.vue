<template>
    <v-layout column>
        <v-container fluid grid-list-md>
            <v-layout row wrap>
                <v-flex xs12 sm4>
                    <v-card>
                        <v-card-title primary-title>
                            <v-layout row align-center>
                                <v-flex xs6>
                                    <v-layout
                                        align-center
                                        justify-space-around
                                        wrap
                                    >
                                        <v-avatar
                                            size="200px"
                                        >
                                            <img
                                                src="/images/me.jpg"
                                                alt="sandman"
                                            >

                                            <v-btn
                                                dark
                                                fab
                                                absolute
                                                right
                                                bottom
                                                color="cyan"
                                                @click="onUpload"
                                            >
                                                <v-icon>camera</v-icon>
                                            </v-btn>
                                        </v-avatar>

                                    </v-layout>

                                </v-flex>

                                <v-flex xs6>
                                    <br>
                                    <h1>Sandman Hakim</h1>
                                    <p>sandman-hakim@live.com</p>
                                    <br>
                                    <h2>1,115,999</h2>
                                    <p>Reputation</p>
                                </v-flex>
                            </v-layout>
                        </v-card-title>

                        <!-- tagline -->
                        <br><br><h3 class="text-sm-center">Talk is cheap, show me your code !</h3><br><br>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            More Info

                            <v-btn icon @click.native="show = !show">
                                <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                            </v-btn>
                        </v-card-actions>

                        <!-- more info -->
                        <v-slide-y-transition>
                            <v-card-text v-show="show">
                                <v-layout row>
                                    <v-flex xs6>Website</v-flex>
                                    <v-flex xs6>hurley</v-flex>
                                </v-layout>

                                <v-layout row>
                                    <v-flex xs6>Location</v-flex>
                                    <v-flex xs6>Indonesia</v-flex>
                                </v-layout>

                                <v-layout row>
                                    <v-flex xs6>Join Date</v-flex>
                                    <v-flex xs6>03/03/2018</v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-slide-y-transition>
                    </v-card>
                </v-flex>

                <v-flex xs12 sm8>
                    <v-card>
                        <v-tabs dark color="blue">
                            <v-tabs-slider color="white"></v-tabs-slider>

                            <!-- tab list -->
                            <v-tab href="#tab-1">
                                Questions
                            </v-tab>

                            <v-tab href="#tab-2">
                                Answers
                            </v-tab>

                            <!-- tab item -->
                            <v-tab-item id='tab-1'>
                                <v-container>
                                    <v-layout row>
                                        <v-flex xs12>
                                            <v-card color="blue-grey lighten-5">
                                                <v-card-title primary-title>
                                                    <v-layout row>
                                                        <v-flex xs10>
                                                            <p>Your question preview will be appear here ...</p>
                                                        </v-flex>

                                                        <v-flex xs2>
                                                            <v-btn flat>go to page</v-btn>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-card-title>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-tab-item>

                            <v-tab-item id='tab-2'>
                                <v-container>
                                    <v-layout row>
                                        <v-flex xs12>
                                            <v-card color="green accent-3">
                                                <v-card-title primary-title>
                                                    <v-layout row>
                                                        <v-flex xs10>
                                                            <p>Your question preview will be appear here ...</p>
                                                        </v-flex>

                                                        <v-flex xs2>
                                                            <v-btn flat>go to page</v-btn>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-card-title>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-tab-item>
                        </v-tabs>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-layout>
</template>

<script>
export default {
    name: "Profile",
    data: () => ({
      show: false,
    }),
    computed: {
        user() {
            return this.$store.state.auth.user;
        },
    }
}
</script>
