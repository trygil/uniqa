'use strict'

const Database = use('Database')

class NotificationController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  async onInit (user_id) {
    let sql = `
        SELECT 
            n."to", 
            n.data->>'context' as context, 
            n.data->>'post_id' as post_id, 
            u.username,
            p.title,
            p.parent_id IS NOT NULL AS is_answer,
            MAX(n.created_at) AS created_at
        FROM notifications AS n
        JOIN users AS u ON u.id = (n.data->>'by')::integer 
        JOIN posts AS p ON p.id = (n.data->>'post_id')::integer 
        WHERE n."to" <> (n.data->>'by')::integer AND 
              n."to" = ?
        GROUP BY n."to", n.data->>'context', n.data->>'post_id', u.id, p.id
        ORDER BY n.data->>'post_id', n.data->>'context'`;

    try {
        let response = await Database.raw(sql, [user_id]);


        if (response.rows.length > 0) {
            // broadcast websocket
            this.socket.broadcastToAll('all', response.rows);
        }
    } catch(err) {
        console.error(err)
    }
  }

  onNew (message) {
    console.log("receive new notif " + message);
  }

  onError () {
    console.error("same as: socket.on('error')");
  }

}

module.exports = NotificationController
