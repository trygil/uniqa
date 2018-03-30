'use strict'

class UserController {
    async getLogin({request, view, auth}) {
        try {
            await auth.check()
        } catch (error) {
            return view.render('admin.login')
        }
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

    async logout({response, auth}) {
        try {
            await auth.logout();
        } catch (error) {
            return response.redirect('/')
        }

        return response.redirect('/login')
    }

    async data({request, auth}) {
        return auth.user;
    }
}

module.exports = UserController
