<template>
    <v-layout>
        <v-flex xs12 sm8 offset-sm2>
            <v-form @submit.prevent="save">
                <v-card>
                    <v-card-title>
                        <div class="headline">
                            <v-icon>question_answer</v-icon>
                        </div>
                        <v-flex lg12>
                            <v-text-field
                                v-model="form.question"
                                :label="$t('question.labels.question')"
                                ></v-text-field>
                        </v-flex>
                        <v-flex lg12>
                            <v-text-field
                                v-model="form.description"
                                :label="$t('question.labels.description')"
                                textarea></v-text-field>
                        </v-flex>
                        <v-flex lg12>
                            <v-select
                                v-model="form.tags"
                                :label="$t('question.labels.tags')"
                                chips
                                tags></v-select>
                        </v-flex>
                    </v-card-title>
                    <v-card-actions>
                        <v-btn type="submit" size="large" outline color="primary"> {{ $t('question.labels.submit') }} </v-btn>
                        <v-btn size="large" @click="back" outline color="default"> {{ $t('action.cancel') }} </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    name: "QuestionForm",
    data() {
        return {
            form: {},
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        async save() {
            let response = await this.$http.post("/question", this.form)
                .then((res) => {
                    this.$message.success(this.$t("question.messages.save_success"));

                    // redirecting after 2 seconds
                    setTimeout(this.back, 2000);
                })
                .catch((err) => {
                    this.$message.error(this.$t("question.messages.save_failed"));
                });
        },
    },
};
</script>