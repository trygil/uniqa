'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/Admin/User', async (faker) => {
    return {
        name: "Admin",
        username: faker.username(),
        password: "admin",// no need to hash because we're using hash hook in the 'App/Models/Admin/User'
        email: faker.email(),
    };
});

Factory.blueprint('App/Models/Admin/Person', async (faker) => {
    return {
        first_name: faker.first(),
        last_name: faker.last(),
        email: faker.email(),
    };
});
