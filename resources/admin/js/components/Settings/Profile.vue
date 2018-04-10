<template>
    <div>
        <h1>Profile</h1>

        <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
                label="Name"
                v-model="name.value"
                :rules="name.rules"
                required
            ></v-text-field>
        </v-form>
    </div>
</template>

<script>
    export default {
        name: "SettingsAccount",
        data: () => ({
            valid: false,
            name: {
                value: '',
                rules: [
                    v => !!v || 'Name is required',
                    v => v.length <= 10 || 'Name must have at least than 10 characters.',
                ],
            },
        })
    }
</script>
