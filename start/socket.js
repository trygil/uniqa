const Ws = use('Ws')

Ws.channel('notification:*', 'NotificationController')