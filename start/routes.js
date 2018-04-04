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
const Person = use('App/Models/Admin/Person')

Route.group(() => {
    Route.on('/').render('uniqamente')

    Route.get('/accept/:token', 'PersonController.acceptInvitation')
}).domain('uni.qa')

Route.group(() => {
    Route.get('/login', 'AdminController.getLogin')
    Route.post('/login', 'AdminController.postLogin')

    Route.get('/logout', 'AdminController.logout').middleware(['admin_auth'])
    Route.get('/user/data', 'AdminController.data').middleware(['admin_auth'])
    Route.get('/person/data', 'PersonController.data').middleware(['admin_auth'])
    Route.post('/invitation/invite', 'PersonController.invite').middleware(['admin_auth'])
    Route.post('/invitation/cancel', 'PersonController.cancel').middleware(['admin_auth'])

    // SPA route
    Route.any('*', ({ view, auth }) => view
        .render('admin.main', {
            user: auth.authenticator('admin').user
        })
    ).middleware(['admin_auth'])
}).domain('admin.uni.qa')
