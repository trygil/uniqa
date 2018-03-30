'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.group(() => {
    Route.on('/').render('welcome')
}).domain('uni.qa')

Route.group(() => {
    Route.get('/login', 'UserController.getLogin')
    Route.post('/login', 'UserController.postLogin')
}).domain('admin.uni.qa')

Route.group(() => {
    Route.get('/logout', 'UserController.logout')
    Route.get('/user/data', 'UserController.data')

    // SPA route
    Route.any('*', ({ view, auth }) => view.render('admin.main', {user: auth.user})).middleware(['admin_auth'])
}).domain('admin.uni.qa')
