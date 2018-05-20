<template>
    <v-layout column>
        <v-container fluid grid-list-md>
            <v-layout row wrap>
                <v-flex xs12 sm4>
                    <v-card>
                        <v-card-media
                        src="#"
                        height="200px"
                        >
                        Profile Pict goes here ...
                        </v-card-media>

                        <v-card-title primary-title>
                            <v-layout row>
                                <v-flex xs8>
                                    <h1>Sandman Hakim</h1>
                                    <v-subheading>sandman-hakim@live.com</v-subheading>
                                </v-flex>

                                <v-flex xs4>
                                    <h1 class="text-lg-right">1,115,999</h1>
                                    <p class="text-lg-right">
                                        <v-subheading>Reputation</v-subheading>
                                    </p>
                                </v-flex>
                            </v-layout>
                        </v-card-title>

                        <!-- tagline -->
                        <h3 class="text-sm-center">Talk is cheap, show me your code !</h3>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            More Info

                            <v-btn icon @click.native="show = !show">
                                <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                            </v-btn>
                        </v-card-actions>

                        <v-slide-y-transition>
                            <v-card-text v-show="show">
                                <v-layout row>
                                    <v-flex xs6>Website</v-flex>
                                    <v-flex xs6>hurley.co.id</v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6>Location</v-flex>
                                    <v-flex xs6>Indonesia</v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-slide-y-transition>
                    </v-card>
                </v-flex>

                <v-flex xs12 sm8>
                    <v-card>
                        <v-card-title primary-title>
                            <div>
                                <!-- username -->
                                <div class="headline">Status</div>
                                <!-- email -->
                                <span class="grey--text">graph or something etc.</span>
                            </div>
                        </v-card-title>

                        <!-- <v-card-media
                        src="#"
                        height="200px"
                        >
                        Profile Pict goes here ...
                        </v-card-media> -->
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
      show: false
    })
}
</script>
