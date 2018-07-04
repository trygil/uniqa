<template>
<div id="login-panel">
    <v-flex lg12>
        <v-card>
            <v-card-title>
                <v-flex sm10 offset-sm1>
                    <v-text-field
                        v-model="form.email"
                        label="Email"
                        ></v-text-field>
                </v-flex>
                <v-flex sm10 offset-sm1>
                    <v-text-field
                        v-model="form.password"
                        label="Password"
                        type="password"
                        ></v-text-field>
                </v-flex>
            </v-card-title>
            <v-card-actions>
                <div>
                    <v-btn color="primary" @click="login">Login</v-btn>
                </div>
                <div>
                    <a href="#">Don't have an account? Sign up</a>
                </div>
            </v-card-actions>
        </v-card>
    </v-flex>
</div>
</template>

<script>
export default {
    name: "SimpleLogin",
    data() {
        return {
            form: {},
        };
    },
    methods: {
        login() {
            let response = this.$store.dispatch("attemptLogin", this.form);
            response
                .then(() => {
                    // reset form
                    this.form = {};
                })
                .catch((e) => {
                    this.$message.error(this.$t("auth.messages.login-failed"))
                });
        },
    },
};
</script>
