'use strict'

const Model = use('Model')
const Database = use('Database')
const Ws = use('Ws')

class Notification extends Model {
    static boot () {
        super.boot()

        this.addHook('afterCreate', async (notification) => {
            let sql = `
                SELECT 
                    n."to", 
                    n.data->>'context' as context, 
                    n.data->>'post_id' as post_id, 
                    u.username,
                    p.title,
                    n.created_at
                FROM notifications AS n
                JOIN users AS u ON u.id = (n.data->>'by')::integer 
                JOIN posts AS p ON p.id = (n.data->>'post_id')::integer 
                WHERE n."to" <> (n.data->>'by')::integer AND 
                      n.id = ?`;

            let response = await Database.raw(sql, [notification.id]);

            if (response.rows.length > 0) {
                let topic = Ws.getChannel('notification:*').topic("notification:" + notification.to);

                // check if user online, if so
                // broadcast new notification
                if (topic)
                  topic.broadcast('new', response.rows);
            }
        });
    }

}

module.exports = Notification
