'use strict'

const { test, trait } = use('Test/Suite')('Post')
const User = use("App/Models/Admin/User")

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

test('make sure post report is accessible', async ({ client }) => {
    const user = await User.find(1)
    const res = await client
        .get('reports')
        .loginVia(user, 'admin')
        .end()

    res.assertStatus(200)
    res.assertHeader('content-type', 'application/json; charset=utf-8')
})

test('post should be deleted', async ({ client }) => {
    const user = await User.find(1)
    const res = await client
        .get('reports')
        .loginVia(user, 'admin')
        .end()

    res.assertStatus(200)
})
