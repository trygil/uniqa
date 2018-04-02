'use strict'

const Model = use('Model')

class Invitation extends Model {
  // override table name
  static get table () {
    return 'admin.invitations'
  }
}

module.exports = Invitation
