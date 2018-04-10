<template>
    <div>
        <h2 class="grey--text">Profile</h2>

        <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
                label="Name"
                v-model="name.value"
                :rules="name.rules"
                required
            ></v-text-field>

            <v-btn @click="submit" :disabled="!valid"> submit </v-btn>
        </v-form>
    </div>
</template>

<script>
    import Vue from 'vue'
    import _ from 'lodash'

    export default {
        name: "SettingsAccount",

        data: () => ({
            valid: false,
            name: {
                value: '',
                rules: [
                    v => !!v || 'Name is required',
                    v => v.length >= 10 || 'Name must have at least than 10 characters.',
                ],
            },
        }),

        mounted() {
            const vm = this;

            Vue.http("/admin/profile")
                .then((res) => {
                    for (var i in res.data) {
                        if (!_.isUndefined(vm.$data[i])) {
                            vm.$data[i].value = res.data[i];
                        }
                    }
                })
        },

        methods: {
            submit() {
                if (this.$refs.form.validate()) {
                    const vm = this;

                    Vue.http
                        .post("/admin/profile", { name: vm.name.value })
                        .then(() => { vm.$message.success("Your profile has been updated successfully.") })
                        .catch(err => { vm.$message.error("Failed to update your profile.") })
                }
            }
        },
    }
</script>
