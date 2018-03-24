'use strict'

const Schema = use('Schema')

class CreateAdminToken extends Schema {
  up () {
    this.create('admin.tokens', table => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('admin.users')
      table.string('token', 40).notNullable().unique()
      table.string('type', 80).notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('tokens')
  }
}

module.exports = CreateAdminToken
