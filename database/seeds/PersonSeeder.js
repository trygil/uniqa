'use strict'

const Factory = use('Factory')

class PersonSeeder {
  async run () {
    const usersArray = await Factory
      .model('App/Models/Admin/Person')
      .createMany(100)
  }


}

module.exports = PersonSeeder
