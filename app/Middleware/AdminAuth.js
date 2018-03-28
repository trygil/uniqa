'use strict'

class AdminAuth {
    async handle ({ request, response, auth }, next) {
        // call next to advance the request
        if(!auth.user){
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
