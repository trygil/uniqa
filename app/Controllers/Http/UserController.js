'use strict'

class UserController {
    getLogin({request, view}) {
        return view.render('login')
    }

    postLogin() {
        return render('login')
    }
}

module.exports = UserController
