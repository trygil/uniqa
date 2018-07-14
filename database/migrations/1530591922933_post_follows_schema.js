'use strict'

const Schema = use('Schema')

class PostFollowsSchema extends Schema {
  up () {
    this.create('post_follows', (table) => {
      table.integer('post_id')
        .references('id')
        .inTable('posts')
        .onUpdate('cascade')
        .onDelete('cascade');

      table.integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('cascade')
        .onDelete('cascade');

      table.timestamps();

      table.primary(['post_id', 'user_id']);
    })
  }

  down () {
    this.drop('post_follows')
  }
}

module.exports = PostFollowsSchema
