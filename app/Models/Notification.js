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
                      n."to" = ?
                ORDER BY n.data->>'post_id', n.created_at DESC, n.data->>'context'`;

            let response = await Database.raw(sql, [notification.to]);

            if (response.rows.length > 0) {
                // broadcast websocket
                Ws.getChannel('notification:*')
                  .topic("notification:" + notification.to)
                  .broadcast('new', response.rows);
            }
        });
    }

}

module.exports = Notification
