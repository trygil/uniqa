'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique() // langsung di set sesuai table 'persons'
      table.string('password', 256).notNullable()
      table.string('picture', 256)
      table.smallint('type').notNullable().default(0) // tipe user (mahasiswa/dosen/staff/etc)
      table.smallint('status').notNullable().default(0) // status (not-activated/active/banned)
      table.jsonb('data')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
