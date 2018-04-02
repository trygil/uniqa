'use strict'

const Schema = use('Schema')

class CreateAdminInvitationsSchema extends Schema {
  up () {
    this.create('admin.invitations', (table) => {
      table.increments('id')
      table.string('token', 255).notNullable().unique()
      table.integer('person_id').notNullable()
      table.smallint('status').notNullable().default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('admin.invitations')
  }
}

module.exports = CreateAdminInvitationsSchema
