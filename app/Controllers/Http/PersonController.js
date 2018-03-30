'use strict'

const Person = use('App/Models/Admin/Person')

class PersonController {
    async data({request}) {
        let persons = await Person.query().paginate(1, 5);
        return persons;
    }
}

module.exports = PersonController
