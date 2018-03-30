'use strict'

const Model = use('Model')

class Token extends Model {
  // override table name
  static get table () {
    return 'admin.tokens'
  }
}

module.exports = Token
