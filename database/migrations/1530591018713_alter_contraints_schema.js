'use strict'

const Schema = use('Schema')

class AlterContraintsSchema extends Schema {
  up () {
    this.table('posts', (table) => {
      table.dropForeign('parent_id');
      table.integer('parent_id')
        .alter()
        .references('id')
        .inTable('posts')
        .onUpdate('cascade')
        .onDelete('cascade');

      table.dropForeign('user_id');
      table.integer('user_id')
        .alter()
        .references('id')
        .inTable('users')
        .onUpdate('cascade')
        .onDelete('cascade');
    });

    this.table('comments', (table) => {
      table.integer('post_id')
        .alter()
        .references('id')
        .inTable('posts')
        .onUpdate('cascade')
        .onDelete('cascade');

      table.dropForeign('user_id');
      table.integer('user_id')
        .alter()
        .references('id')
        .inTable('users')
        .onUpdate('cascade')
        .onDelete('cascade');
    });
  }

  down () {
    this.table('comments', (table) => {
      table.dropForeign('post_id');
    })
  }
}

module.exports = AlterContraintsSchema
