'use strict'

const Model = use('Model')

class Report extends Model {
    static get primaryKey () {
        return ['post_id', 'user_id'];
    }
}

module.exports = Report
