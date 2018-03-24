'use strict'

const Schema = use('Schema')

class CreateAdminInvitationsSchema extends Schema {
  up () {
    this.create('invitations', (table) => {
      table.increments('id')
      table.string('token', 255).notNullable()
      table.integer('status').notNullable().default(0)
      table.integer('persons_id').notNullable().references('id').inTable('admin.persons')
      table.jsonb('data')
      table.timestamps()
    })
  }

  down () {
    this.drop('invitations')
  }
}

module.exports = CreateAdminInvitationsSchema
