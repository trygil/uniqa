'use strict'

/*
|--------------------------------------------------------------------------
| AdminUserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')

class AdminUserSeeder {
  async run () {
    const usersArray = await Factory
      .model('App/Models/Admin/User')
      .createMany(5)
  }


}

module.exports = AdminUserSeeder
