'use strict'

class UserController {
    async getLogin({request, view, auth}) {
        try {
            await auth.check()
        } catch (error) {
            return view.render('login')
        }

        return view.render('welcome')
    }

    async postLogin({request, response, auth, session}) {
        const { username, password } = request.except(['csrf_token', 'submit']);
        
        try {
            await auth.attempt(username, password)
        } catch(e) {
            session.flash({ message: 'Username or password didn\'t match' })
        }

        return response.redirect('/')
    }
}

module.exports = UserController
