'use strict'

const Database = use('Database')
const Person = use('App/Models/Admin/Person')
const Invitation = use('App/Models/Admin/Invitation')
const User = use('App/Models/User')
const Mail = use('Mail')

class PersonController {
    async data({request}) {
        const params = request.all();
        let query = Database.table('admin.persons as p');
        query.leftJoin(
            Database.raw('(SELECT person_id FROM admin.invitations GROUP BY person_id) as i'), 
            'i.person_id', '=', 'p.id'
        );

        let sortby = ['p.' + params.sortby];
        if (params.sortby == 'full_name')
            sortby = ['p.first_name', 'p.last_name'];

        if (params.sortby)
            for (let i in sortby)
                query.orderBy(sortby[i], JSON.parse(params.asc) ? 'asc' : 'desc');

        query.select([
            'p.id', 
            'p.first_name', 
            'p.last_name', 
            'p.email', 
            'p.data', 
            Database.raw('i.person_id IS NOT NULL as invited')
        ]);

        if (params.search)
            query.whereRaw(`
                p.first_name || p.last_name ILIKE ? OR
                p.email ILIKE ?`, [params.search + '%', params.search + '%']
            );


        let persons = await query.paginate(params.page, params.perpage);

        return persons
    }

    async invite({request}) {
        const Encryption = use('Encryption')
        const Env = use('Env')

        const reqParam = request.all()
        const trx = await Database.beginTransaction()
        const person = await Person.find(reqParam.id)

        // delete old invitation(s)
        await Invitation.query().where('person_id', reqParam.id).delete(trx)

        // make invitation
        const invitation = new Invitation()

        invitation.fill({
            token: Encryption.encrypt(reqParam.id),
            person_id: reqParam.id,
        })

        await invitation.save(trx)

        // Send Invitation Link
        const param = {
            link: Env.get('APP_URL') + '/accept/' + encodeURIComponent(invitation.token),
            person: person,
        }

        await Mail.send('email.invitation', param, (message) => {
            message
                .to(person.email)
                .from('invitation@uni.qa')
                .subject('Invitation Link')
        })

        trx.commit()

        return 'Registered successfully'
    }

    async acceptInvitation({response, session, params}) {
        const Hash = use('Hash')

        try {
            const trx = await Database.beginTransaction()

            const invitation = await Invitation.findByOrFail('token', decodeURIComponent(params.token))
            invitation.status = 1
            await invitation.save(trx)

            const person = await Person.findByOrFail('id', invitation.person_id)
            const user = new User()
            const password = Math.random().toString(36).substring(2)

            user.fill({
                username: Math.random().toString(36).substring(2),
                email: person.email,
                password: await Hash.make(password),
            })

            // Send Password Info
            await Mail.send('email.password', { password }, (message) => {
                message
                    .to(person.email)
                    .from('info@uni.qa')
                    .subject('Password Information')
            })

            person.status = 1;
            await person.save(trx)
            await user.save(trx)

            trx.commit()
            session.flash({ success: ['Akun anda telah sukses terdaftar. Silahkan login'] })

            return response.redirect('/login')
        }
        catch (e) {
            // invalid token
            console.error(e)
            session.flash({ error: ['Gagal mendaftarkan akun, link undangan mungkin telah kadaluarsa'] })
        }

        return response.redirect('/')
    }

    async cancel({request}) {
        const Encryption = use('Encryption')
        const Env = use('Env')

        const reqParam = request.all()
        const trx = await Database.beginTransaction()

        // delete old invitation(s)
        await Invitation.query().where('person_id', reqParam.id).delete(trx)

        trx.commit()

        return 'Invitation canceled'
    }

    async add({request, response}) {
        const params = request.all().person;
        const trx = await Database.beginTransaction()

        let person = new Person();

        person.first_name = params.first_name;
        person.last_name = params.last_name;
        person.email = params.email;

        await person.save(trx);

        trx.commit()

        return 'Data edited';
    }

    async edit({request, response}) {
        const params = request.all().person;
        const trx = await Database.beginTransaction()

        let person = await Person.find(params.id)

        if (!person)
            return response.status(404).send('Not found!')

        person.first_name = params.first_name;
        person.last_name = params.last_name;
        person.email = params.email;

        await person.save(trx);

        trx.commit()

        return 'Data edited';
    }
}

module.exports = PersonController
