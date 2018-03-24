'use strict'

const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.bigIncrements()
      table.integer('post_id').notNullable()
      table.integer('user_id').notNullable().references('id').inTable('users')
      table.string('comment', 256).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
