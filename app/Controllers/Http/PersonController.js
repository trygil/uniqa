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
        let subsql = '(SELECT person_id FROM admin.invitations GROUP BY person_id) as i';

        query.leftJoin(Database.raw(subsql), 'i.person_id', '=', 'p.id')
            .leftJoin("public.users as up", "up.email", "=", "p.email");

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
            Database.raw('up.id IS NOT NULL as registered'),
            Database.raw('COALESCE(up.type, 0) as user_type'),
            Database.raw('i.person_id IS NOT NULL as invited'),
        ]);

        if (params.search)
            query.whereRaw(`
                p.first_name || p.last_name ILIKE ? OR
                p.email ILIKE ?`, [params.search + '%', params.search + '%']
            );

        // uninvited
        if (params.filter == 1)
            query.whereRaw("i.person_id IS NULL AND up.id IS NULL");

        // invited
        if (params.filter == 2)
            query.whereRaw("i.person_id IS NOT NULL AND up.id IS NULL");

        // registered
        if (params.filter == 4)
            query.whereRaw("up.id IS NOT NULL");

        let persons = [];

        try {
            persons = await query.paginate(params.page, params.perpage);
        } catch(e) {
            console.error(e);
        }

        return persons
    }

    async invite({request}) {
        const Encryption = use('Encryption')
        const Env = use('Env')

        const reqParam = request.all()
        const trx = await Database.beginTransaction()
        
        try {
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
                    .from(Env.get('MAIL_ADDRESS'))
                    .subject('Invitation Link')
            })

            trx.commit()
        } catch (e) {
            console.error(e);
            return response.status(500).send('failed to send invitation');
        }

        return response.send('invitation sent');
    }

    async acceptInvitation({response, session, params, view}) {
        const Env = use('Env')

        try {
            const invitation = await Invitation.findByOrFail('token', decodeURIComponent(params.token))
            const person = await Person.findByOrFail('id', invitation.person_id)
            const user = await User.findBy('email', person.email);

            if (user) {
                session.flash({ error: ['Email ini telah terdaftar sebagai user, silahkan login'] })
                return response.redirect(Env.get('APP_URL'))
            }

            let token = encodeURIComponent(invitation.token);

            return view.render('app/register', {invitation, person, token})
        }
        catch (e) {
            console.error(e)

            // invalid token
            session.flash({ error: ['Gagal mendaftarkan akun, link undangan mungkin telah kadaluarsa'] })
        }

        return response.redirect(Env.get('APP_URL'))
    }

    async register({request, response}) {
        const form = request.all();

        const trx = await Database.beginTransaction()

        try {
            const invitation = await Invitation.findByOrFail('token', decodeURIComponent(form.token))
            const person = await Person.findByOrFail('id', invitation.person_id)

            let user = new User();
            user.username = form.username;
            user.password = form.password;
            user.email = person.email;

            await user.save(trx);

            trx.commit();

            return response.status(200).redirect("/");
        }
        catch (e) {
            trx.rollback();
            console.error(e);
        }

        return response.redirect("back");
    }

    async checkUsername({request, response}) {
        try {
            const username = request.all().username;
            await User.findByOrFail("username", username);

            return response.status(401).send("username already registered");
        } catch(e) {
            console.error(e);
            return response.status(200).send("username not registered");
        }
    }

    async cancel({request}) {
        const Encryption = use('Encryption');
        const Env = use('Env');

        const reqParam = request.all();
        const trx = await Database.beginTransaction();

        try {
            // delete old invitation(s)
            // await Invitation.query().where('person_id', reqParam.id).delete(trx)

            // get person data
            let person = await Person.find(reqParam.id);
            if (person) {
                let user = await User.query().where('email', person.email).first();

                // delete user associated with this 'person'
                if (user) user.delete(trx);
            }

            trx.commit();
        } catch(e) {
            trx.rollback();
            console.error(e);
        }

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

        return 'Data saved';
    }

    async edit({request, response}) {
        const params = request.all().person;
        const trx = await Database.beginTransaction();

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

     async delete({request, response}) {
        const id = request.all().id;
        const trx = await Database.beginTransaction()

        try {
            let person = await Person.find(id)

            if (!person)
                return response.status(404).send('Not found!')

            let user = await User.query().where('email', person.email).first();

            // delete user associated with this 'person'
            if (user) user.delete(trx);

            // delete person
            await person.delete(trx);

            trx.commit();
        } catch(e) {
            trx.rollback();
            console.error(e);

            return response.status(500).send("something wrong! i don't know why")
        }

        return 'Data deleted';
    }
}

module.exports = PersonController
