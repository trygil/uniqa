'use strict'

const Model = use('Model')

class Tag extends Model {
    static get primaryKey () {
        return 'tag'
    }

}

module.exports = Tag
