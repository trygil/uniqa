'use strict'

class AdminController {
    async getLogin({request, view, auth, response}) {
        try {
            let logged_in = await auth.authenticator('admin').check()
        } catch (error) {
            return view.render('admin.login')
        }

        return response.redirect('/')
    }

    async postLogin({request, response, auth, session}) {
        const { username, password } = request.except(['csrf_token', 'submit']);

        try {
            await auth.authenticator('admin').attempt(username, password)
            return response.redirect('/')
        } catch(e) {
            session.flash({ message: 'Username or password didn\'t match' })
        }
    }

    async logout({response, auth}) {
        try {
            await auth.authenticator('admin').logout();
        } catch (error) {
            return response.redirect('/')
        }

        return response.redirect('/login')
    }

    async data({request, auth}) {
        let user = await auth.authenticator('admin').user
        return user;
    }
}

module.exports = AdminController
