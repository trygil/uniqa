'use strict'

const Schema = use('Schema')

class AlterAdminUsersSchema extends Schema {
  up () {
    this.table('admin.users', (table) => {
      table.string('name').notNullable().default("-")
    })
  }

  down () {
    this.table('admin.users', (table) => {
      table.dropColumn('name')
    })
  }
}

module.exports = AlterAdminUsersSchema
