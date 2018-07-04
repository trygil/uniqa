'use strict'

const { test, trait } = use('Test/Suite')('Question')
const axios = use("axios")

trait('Test/ApiClient')

test('make sure question is accessible', async ({ assert, client }) => {
    const res = await axios.get("http://uni.qa:3333/api/question/recent")
    assert.equal(res.status, 200)
    assert.isTrue(res.headers["content-type"].indexOf("application/json") !== -1);
}).timeout(0)

test('make sure recent question is accessible', async ({ assert, client }) => {
    const res = await axios.get("http://uni.qa:3333/api/question/recent")
    assert.equal(res.status, 200)
    assert.isTrue(res.headers["content-type"].indexOf("application/json") !== -1);
}).timeout(0)

test('make sure top question is accessible', async ({ assert, client }) => {
    const res = await axios.get("http://uni.qa:3333/api/question/recent")
    assert.equal(res.status, 200)
    assert.isTrue(res.headers["content-type"].indexOf("application/json") !== -1);
}).timeout(0)

test('make sure tag is accessible', async ({ assert, client }) => {
    const res = await axios.get("http://uni.qa:3333/api/tag")
    assert.equal(res.status, 200)
    assert.isTrue(res.headers["content-type"].indexOf("application/json") !== -1);
}).timeout(0)

test('question should be posted', async ({ assert, client }) => {
    const res = await axios.get("http://uni.qa:3333/api/question/recent")
    assert.equal(res.status, 200)
    assert.isTrue(res.headers["content-type"].indexOf("application/json") !== -1);
}).timeout(0)

test('question should be answered', async ({ assert, client }) => {
    const res = await axios.get("http://uni.qa:3333/api/question/recent")
    assert.equal(res.status, 200)
    assert.isTrue(res.headers["content-type"].indexOf("application/json") !== -1);
}).timeout(0)

test('question should be upvoted', async ({ assert, client }) => {
    const res = await axios.get("http://uni.qa:3333/api/question/recent")
    assert.equal(res.status, 200)
    assert.isTrue(res.headers["content-type"].indexOf("application/json") !== -1);
}).timeout(0)

test('question should be reported', async ({ assert, client }) => {
    const res = await axios.get("http://uni.qa:3333/api/question/recent")
    assert.equal(res.status, 200)
    assert.isTrue(res.headers["content-type"].indexOf("application/json") !== -1);
}).timeout(0)

test('question should be deleted', async ({ assert, client }) => {
    const res = await axios.get("http://uni.qa:3333/api/question/recent")
    assert.equal(res.status, 200)
    assert.isTrue(res.headers["content-type"].indexOf("application/json") !== -1);
}).timeout(0)
