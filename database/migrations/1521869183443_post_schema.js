'use strict'

const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.string('title').notNullable() // title post
      table.text('post').notNullable() // isi post
      table.integer('user_id').notNullable().references('id').inTable('users')
      table.smallint('type').notNullable().default(0) // (question/answer/etc?)

      // jika post berjenis 'answer' maka parent_id mengarah ke post question-nya
      // by default null
      table.integer('parent_id').references('id').inTable('posts')

      /**
       * if (type == question) [open, solved, closed]
       * if (type == answer) [open, closed, ]
       */
      table.smallint('status').notNullable().default(0)
      table.integer('upvote').default(0) // akumulasi upvote/rate, downvote mengurangi nilai upvote

      /**
       * isi: 
       * - tags e.g. 'perkuliahan', 'perwalian', 'autodebet', 'matematika diskrit', etc
       * 
       * (jika post berjenis 'question' maka choosen_id mengarah ke answer yg dipilih)
       * - choosen_id <integer>
       * 
       * (jika post berjenis 'answer' maka is_choosen)
       * - is_choosen <boolean, default = false>
       *
       * (string tanggal ketika 'answer' dipilih sebagai jawaban)
       * - choosen_at <string>
       * 
       * - data lainnya jika perlu hehe
       */
      table.jsonb('data')

      table.timestamps()
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
