'use strict'

const Database = use('Database')
const Person = use('App/Models/Admin/Person')
const Invitation = use('App/Models/Admin/Invitation')
const User = use('App/Models/User')
const Mail = use('Mail')

class PersonController {
    async data({request}) {
        let persons = await Person.query().paginate(1, 5)

        return persons
    }

    async invite({request}) {
        const Encryption = use('Encryption')
        const Env = use('Env')

        const reqParam = request.all()
        const trx = await Database.beginTransaction()
        const person = await Person.find(reqParam.id)

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

            await user.save(trx)

            trx.commit()
            session.flash({ success: ['Akun anda telah sukses terdaftar. Silahkan login'] })

            return response.redirect('/login')
        }
        catch (e) {
            // invalid token
            console.log(e)
        }

        return response.redirect('/')
    }
}

module.exports = PersonController
