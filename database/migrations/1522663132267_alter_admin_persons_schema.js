'use strict'

const Schema = use('Schema')

class AlterAdminPersonsSchema extends Schema {
  up () {
    this.table('admin.persons', (table) => {
      table.smallint('status').notNullable().default(0)
    })
  }

  down () {
    this.table('admin.persons', (table) => {
      table.dropColumn('status')
    })
  }
}

module.exports = AlterAdminPersonsSchema
