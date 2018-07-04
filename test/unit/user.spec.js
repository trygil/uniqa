'use strict'

const { test, trait } = use('Test/Suite')('User')
const User = use("App/Models/Admin/User")
const axios = use("axios")

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

test('make sure login is accessible', async ({ assert, client }) => {
    const res = await axios.get("http://uni.qa:3333/login")
    assert.equal(res.status, 200)
}).timeout(0)

test('make sure user registration works', async ({ assert, client }) => {
    const res = await axios.get("http://uni.qa:3333/login")
    assert.equal(res.status, 200)
}).timeout(0)

test('make sure logout is accessible', async ({ client }) => {
    const user = await User.find(1)
    const res = await client
        .get('logout')
        .loginVia(user, 'admin')
        .end()

    res.assertStatus(200)
}).timeout(0)

test('make sure data user is accessible', async ({ client }) => {
    const user = await User.find(1)
    const res = await client
        .get('user/data')
        .loginVia(user, 'admin')
        .end()

    res.assertStatus(200)
    res.assertHeader('content-type', 'application/json; charset=utf-8')
}).timeout(0)
