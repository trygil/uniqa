'use strict'

class AppController {
    index({request, view}) {
        return view.render('welcome')
    }

    async getLogin({request, view}) {
        return view.render('app.login')
    }
}

module.exports = AppController
