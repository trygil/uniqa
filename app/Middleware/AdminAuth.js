'use strict'

class AdminAuth {
    async handle ({ request, response, auth }, next) {

        let is_logged_in = false;
        try {
            is_logged_in = await auth.authenticator('admin').check();
        } catch(e) {
            is_logged_in = !!auth.authenticator('admin').user;
        }

        // call next to advance the request
        if(!is_logged_in) {
            return response.redirect('/login')
        }

        // call next to advance the request
        await next()
    }
    async wsHandle ({ request }, next) {
        // call next to advance the request
        await next()
    }
}

module.exports = AdminAuth
