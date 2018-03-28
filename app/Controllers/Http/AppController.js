'use strict'

class AppController {
    index({request, view}) {
        return view.render('welcome')
    }
}

module.exports = AppController
