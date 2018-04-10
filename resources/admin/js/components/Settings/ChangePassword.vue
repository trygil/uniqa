<template>
    <div>
        <h1>Account</h1>

        <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
              name="old-password"
              label="Old Password"
              hint="At least 8 characters"
              v-model="oldPassword.value"
              :type="oldPassword.hide ? 'password' : 'text'"
              :append-icon="oldPassword.hide ? 'visibility_off' : 'visibility'"
              :append-icon-cb="() => { return oldPassword.hide = !oldPassword.hide }"
              :rules="oldPassword.rules"
              counter
            ></v-text-field>

            <v-text-field
              name="new-password"
              label="New Password"
              hint="At least 8 characters"
              v-model="newPassword.value"
              :type="newPassword.hide ? 'password' : 'text'"
              :append-icon="newPassword.hide ? 'visibility_off' : 'visibility'"
              :append-icon-cb="() => { return newPassword.hide = !newPassword.hide }"
              :rules="newPassword.rules"
              counter
            ></v-text-field>

            <v-text-field
              name="confirm-password"
              label="Confirm Password"
              hint="At least 8 characters"
              v-model="confirmPassword.value"
              :type="confirmPassword.hide ? 'password' : 'text'"
              :append-icon="confirmPassword.hide ? 'visibility_off' : 'visibility'"
              :append-icon-cb="() => { return confirmPassword.hide = !confirmPassword.hide }"
              :rules="confirmPassword.rules"
              counter
            ></v-text-field>

            <v-btn
                @click="submit"
                :disabled="!valid"
            >
                submit
            </v-btn>
        </v-form>
    </div>
</template>

<script>
    import Vue from "vue"

    export default {
        name: "SettingsAccount",

        data: () => ({
            valid: false,
            oldPassword: {
                value: '',
                hide: true,
                rules: [
                    v => !!v || 'Old password is required',
                ],
            },
            newPassword: {
                value: '',
                hide: true,
                rules: [
                    v => !!v || 'New password is required',
                    v => v.length >= 8 || 'Name must be less than 8 characters',
                ],
            },
            confirmPassword: {
                value: '',
                hide: true,
                rules: [
                    v => !!v || 'Confirm password is required',
                ],
            },
        }),

        methods: {
            submit() {
                if (this.$refs.form.validate()) {
                    const vm = this;

                    Vue.http
                        .post("/admin/change-password", {
                            oldPassword: vm.oldPassword.value,
                            newPassword: vm.newPassword.value,
                            confirmPassword: vm.confirmPassword.value,
                        })
                        .then(() => { vm.$message.success("Password has been changed successfully.") })
                        .catch(err => { vm.$message.error(err.response.data) })
                }
            }
        }
    }
</script>
