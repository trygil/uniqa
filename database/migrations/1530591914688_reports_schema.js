'use strict'

const Schema = use('Schema')

class ReportsSchema extends Schema {
  up () {
    this.create('reports', (table) => {
      table.integer('post_id')
        .references('id')
        .inTable('posts')
        .onDelete('cascade')
        .onUpdate('cascade');

      table.integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');

      table.string('reason', 255);
      table.timestamps();

      table.primary(['post_id', 'user_id']);
    })
  }

  down () {
    this.drop('reports')
  }
}

module.exports = ReportsSchema
