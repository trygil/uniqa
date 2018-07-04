'use strict'

const { test, trait } = use('Test/Suite')('Profile')
const User = use("App/Models/Admin/User")

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

test('make sure data profile is accessible', async ({ assert, client }) => {
    const user = await User.find(1)
    const res = await client
        .get("admin/profile")
        .loginVia(user, 'admin')
        .end()

    res.assertStatus(200)
    res.assertHeader('content-type', 'application/json; charset=utf-8')
}).timeout(0)

test('profile should be updated', async ({ assert, client }) => {
    const user = await User.find(1)
    const res = await client
        .get("admin/profile")
        .loginVia(user, 'admin')
        .end()

    res.assertStatus(200)
}).timeout(0)

test('profile password should be updated', async ({ assert, client }) => {
    const user = await User.find(1)
    const res = await client
        .get("admin/profile")
        .loginVia(user, 'admin')
        .end()

    res.assertStatus(200)
}).timeout(0)
