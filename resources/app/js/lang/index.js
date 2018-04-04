import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {}
const files = require.context('.', false, /\.js$/)

// global
files.keys().forEach(key => {
    if (key === './index.js' || !files(key).default) return;

    let lang = Object.keys(files(key).default);
    let msg = files(key).default;

    for (let i in lang) {
        if (messages[lang[i]] == undefined)
            messages[lang[i]] = {};

        messages[lang[i]][key.replace(/(\.\/|\.js)/g, '')] = msg[lang[i]];
    }
})

export default new VueI18n({
    locale: 'id', // set locale
    messages, // set locale messages
})