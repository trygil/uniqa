'use strict'

const Env = use('Env')

module.exports = {

    connection: Env.get('MAIL_CONNECTION', 'smtp'),

    smtp: {
        driver: 'smtp',
        pool: true,
        port: Env.get('MAIL_PORT', 465),
        host: Env.get('MAIL_HOST', 'smtp.mailtrap.io'),
        secure: false,
        auth: {
            user: Env.get('MAIL_USERNAME', 'username'),
            pass: Env.get('MAIL_PASSWORD', 'password'),
        },
        maxConnections: 5,
        maxMessages: 100,
        rateLimit: 10,
    },
};
