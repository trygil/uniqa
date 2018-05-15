'use strict'

const User = use('App/Models/User')

class AppController {
    index({request, view}) {
        return view.render('welcome')
    }

    async getLogin({request, view}) {
        return view.render('app.login')
    }

    async postLogin({request, auth}) {
        const params = request.all();

        const user = await User.query().where("email", "=", params.email).first();
        const payload = {
            username: user.username,
            email: user.email,
        };

        let token = await auth.withRefreshToken().attempt(params.email, params.password, payload);
        return token;
    }

    async refresh({request, auth}) {
        const token = request.input('refresh_token');

        const user = await auth.getUser();
        const payload = {
            username: user.username,
            email: user.email,
        };

        return await auth.generateForRefreshToken(token, payload);
    }
}

module.exports = AppController
