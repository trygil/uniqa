'use strict'

const Schema = use('Schema')

class PostUpvoteSchema extends Schema {
  up () {
    this.create('post_upvotes', (table) => {
      table.integer('post_id').references('id').inTable('posts')
      table.integer('user_id').references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('post_upvotes')
  }
}

module.exports = PostUpvoteSchema
