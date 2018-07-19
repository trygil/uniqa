import Vue from 'vue'
import {
    Row,
    Col,
    Form,
    Input,
    FormItem,
    Button
} from 'element-ui'
import axios from 'axios'
import el_locale from 'element-ui/lib/locale/lang/en'
// import i18n from "./lang"

Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Button)

Vue.prototype.$ELEMENT = {locale: el_locale};
Vue.http = Vue.prototype.$http = axios;

let app = new Vue({
    el: "#login",
    data() {
        var confirmUsername = (rule, value, callback) => {
            if (!this.form.username)
                return callback(new Error("Please input username field"));
            
            if (this.form.username.length < 3 || this.form.username.length > 20)
                return callback(new Error("Username should have 3 until 20 characters"));

                Vue.http.get('/api/check-username', {params: {username: this.form.username}})
                    .then(() => {
                        callback();
                    })
                    .catch((e) => {
                        callback(new Error("this username already used"));
                    })
        };

        var confirmPassword = (rule, value, callback) => {
            if (!this.form.confirm_password)
                return callback(new Error("Please input your password confirmation"))

            if (this.form.password != this.form.confirm_password)
                return callback(new Error("Confirm password doesn't match!"))

            callback();
        };

        return {
            form: {},
            rules: {
                username: [
                    // { required: true, message: 'Please input your password', trigger: 'blur' },
                    { validator: confirmUsername, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please input your password', trigger: 'blur' },
                    { min: 8, message: 'Password should at least 8 characters length', trigger: 'blur' },
                ],
                confirm_password: [
                    { validator: confirmPassword, trigger: 'change' }
                ],
            },
        };
    },
});
