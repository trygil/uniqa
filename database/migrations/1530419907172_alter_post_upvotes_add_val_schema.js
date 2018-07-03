'use strict'

const Schema = use('Schema')

class AlterPostUpvotesAddValSchema extends Schema {
  up () {
    this.table('post_upvotes', (table) => {
      // alter table
      table.integer('val').default(0);

      table.dropForeign('post_id');
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

      table.primary(['post_id', 'user_id'])
    })
  }

  down () {
    this.table('post_upvotes', (table) => {
      // reverse alternation
      table.dropColumn('val');

      table.dropPrimary();
    })
  }
}

module.exports = AlterPostUpvotesAddValSchema
