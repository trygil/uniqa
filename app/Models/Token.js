'use strict'

const Model = use('Model')

class Token extends Model {
  // override table name
  static get table () {
    return 'tokens'
  }
}

module.exports = Token
