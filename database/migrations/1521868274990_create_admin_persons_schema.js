'use strict'

const Schema = use('Schema')

class CreateAdminPersonsSchema extends Schema {
  up () {
    this.create('admin.persons', (table) => {
      table.increments('id')
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('email', 254).notNullable().unique()
      table.jsonb('data')
      table.timestamps()
    })
  }

  down () {
    this.drop('admin.persons')
  }
}

module.exports = CreateAdminPersonsSchema
