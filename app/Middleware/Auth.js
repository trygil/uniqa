'use strict'

class Auth {
    async handle ({ request, response, auth }, next) {
        // const token = request.input('refresh_token');
        // await auth.generateForRefreshToken(token);

        let is_logged_in = false;
        try {
            is_logged_in = await auth.check();
        } catch(e) {
            is_logged_in = !!auth.user;
        }

        // call next to advance the request
        if(!is_logged_in) {
            return response.redirect('/login')
        }

        // call next to advance the request
        await next()
    }
    async wsHandle ({ request, auth }, next) {

        let is_logged_in = false;
        try {
            is_logged_in = await auth.check();
        } catch(e) {
            is_logged_in = !!auth.user;
        }

        // call next to advance the request
        if(!is_logged_in)
            return;

        // call next to advance the request
        await next()
    }
}

module.exports = Auth
