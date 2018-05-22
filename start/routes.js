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
    Route.get('/login', 'AppController.getLogin')
    Route.post('/login', 'AppController.postLogin')
    Route.get('/accept/:token', 'PersonController.acceptInvitation')

    // auth
    Route.get('/checkauth', 'AppController.refresh')

    // questions
    Route.post('/question', 'QuestionController.postQuestion').middleware(['auth'])
    Route.get('/api/question', 'QuestionController.list')
    Route.get('/api/question/hot', 'QuestionController.hot')
    Route.get('/api/question/:id', 'QuestionController.retrieve')

    // SPA route
    Route.any('*', ({ view, auth }) => view.render('uniqamente'));
}).domain('uni.qa')

Route.group(() => {
    Route.get('/login', 'AdminController.getLogin')
    Route.post('/login', 'AdminController.postLogin')

    Route.get('/logout', 'AdminController.logout').middleware(['admin_auth'])
    Route.get('/user/data', 'AdminController.data').middleware(['admin_auth'])
    Route.get('/person/data', 'PersonController.data').middleware(['admin_auth'])
    Route.post('/person/add', 'PersonController.add').middleware(['admin_auth'])
    Route.post('/person/edit', 'PersonController.edit').middleware(['admin_auth'])
    Route.get('/person/delete', 'PersonController.delete').middleware(['admin_auth'])
    Route.post('/invitation/invite', 'PersonController.invite').middleware(['admin_auth'])
    Route.post('/invitation/cancel', 'PersonController.cancel').middleware(['admin_auth'])

    Route.get('/admin/profile', 'AdminController.getProfile').middleware(['admin_auth'])
    Route.post('/admin/profile', 'AdminController.updateProfile').middleware(['admin_auth'])
    Route.post('/admin/change-password', 'AdminController.changePassword').middleware(['admin_auth'])

    // SPA route
    Route.any('*', ({ view, auth }) => view
        .render('admin.main', {
            user: auth.authenticator('admin').user,
        })
    ).middleware(['admin_auth'])
}).domain('admin.uni.qa')
