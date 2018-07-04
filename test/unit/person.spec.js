'use strict'

const { test, trait } = use('Test/Suite')('Person')
const Event = use("Event")
const User = use("App/Models/Admin/User")
const Person = use("App/Models/Admin/Person")

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

test('make sure data person is accessible', async ({ client }) => {
    const user = await User.find(1)
    const res = await client
        .get('person/data')
        .loginVia(user, 'admin')
        .end()
    res.assertStatus(200)
    res.assertHeader('content-type', 'application/json; charset=utf-8')
}).timeout(0)

// test('person should be added', async ({ client }) => {
//     Event.fake()

//     const user = await User.find(1)
//     const sample = {
//         first_name: 'First Name',
//         last_name: 'Last Name',
//         email: 'test@uni.qa',
//     };
//     // const person = await Person.create(sample);

//     const res = await client
//         .post('person/add')
//         .field('first_name', sample.first_name)
//         .field('last_name', sample.last_name)
//         .field('email', sample.email)
//         .loginVia(user, 'admin')
//         .end()
//     res.assertStatus(200)

//     // console.log(person)
//     // const res = await client
    // .get(`person/${person.id}`)
    // .loginVia(user, 'admin')
    // .end()
//     // res.assertJSONSubset([sample])
//     // res.assertHeader('content-type', 'application/json; charset=utf-8')

//     Event.restore()
// }).timeout(0)

test('make sure person CRUD works', async ({ client }) => {
    const user = await User.find(1)
    const sample = {
        first_name: 'First Name',
        last_name: 'Last Name',
        email: 'test@uni.qa',
    };

    // Create Person
    const person = await Person.create(sample);

    // Edit Person
    // sample.first_name += "[edited]"
    // sample.last_name += "[edited]"
    // sample.email += "[edited]"
    // person.fill(sample);
    // await person.save();

    sample.first_name += "[edited]"
    sample.last_name += "[edited]"
    sample.email += "[edited]"
    await person.save();

    // check
    // const res = await client
    //     .get('person/data')
    //     .query({ search: 't' })
    //     // .query({ search: sample.email })
    //     .loginVia(user, 'admin')
    //     .end()

    // Delete Person
    await person.delete();
    // res.assertJSONSubset({data: [sample]})
}).timeout(0)

test('make sure person invitation works', async ({ client }) => {
    const user = await User.find(1)
    const res = await client
        .get('invitation/invite')
        .loginVia(user, 'admin')
        .end()

    res.assertStatus(200)
}).timeout(0)

test('make sure person cancel invitation works', async ({ client }) => {
    const user = await User.find(1)
    const res = await client
        .get('invitation/cancel')
        .loginVia(user, 'admin')
        .end()

    res.assertStatus(200)
}).timeout(0)
