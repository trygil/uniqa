'use strict'

const Model = use('Model')

class Person extends Model {
  // override table name
  static get table () {
    return 'admin.persons'
  }
}

module.exports = Person
