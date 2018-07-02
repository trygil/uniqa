'use strict'

const Schema = use('Schema')

class AlterPostUpvotesAddValSchema extends Schema {
  up () {
    this.table('post_upvotes', (table) => {
      // alter table
      table.integer('val').default(0);

      table.foreign('post_id')
        .onUpdate('cascade')
        .onDelete('cascade');

      table.foreign('user_id')
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
