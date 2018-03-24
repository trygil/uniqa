'use strict'

const Schema = use('Schema')

class CreateAdminSchema extends Schema {
  up () {
    this.raw('create schema admin;');
  }

  down () {
    this.raw('drop schema if exists admin;');
  }
}

module.exports = CreateAdminSchema
