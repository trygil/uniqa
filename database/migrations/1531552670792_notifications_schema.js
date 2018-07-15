'use strict'

const Schema = use('Schema')

class NotificationsSchema extends Schema {
  up () {
    this.create('notifications', (table) => {
      table.bigIncrements('id').primary();
      table.integer('to')
        .references('id')
        .inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
      table.jsonb('data');
      table.timestamps();
    })
  }

  down () {
    this.drop('notifications')
  }
}

module.exports = NotificationsSchema
