'use strict'

const User = use('App/Models/Admin/User')

class AdminController {

    async getLogin({request, view, auth, response}) {
        try {
            let logged_in = await auth.authenticator('admin').check();
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

    async getProfile({request, auth}) {
        let user = await auth.authenticator('admin').user
        return user;
    }

    async updateProfile({request, auth}) {
        const user = await auth.authenticator('admin').user
        const reqParam = request.all()

        user.name = reqParam.name;

        /*user.fill({
            name: reqParam.name,
        })*/

        await user.save()
    }

    async changePassword({request, auth, session, response}) {
        const Hash = use('Hash')

        const reqParam = request.all()
        const user = await auth.authenticator('admin').user

        // invalid old password verification
        const isValid = await Hash.verify(reqParam.oldPassword, user.password)

        if (!isValid) {
            return response.status(500).send('Password lama tidak valid.')
        }

        // invalid password confirmation
        if (reqParam.newPassword != reqParam.confirmPassword) {
            return response.status(500).send('Konfirmasi password baru tidak valid.')
        }

        user.password = await Hash.make(reqParam.newPassword),

        await user.save()

        return 'OK';
    }
}

module.exports = AdminController
