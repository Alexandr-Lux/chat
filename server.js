const WebSocket = require('ws');
const server = new WebSocket.Server({
	port: 3000,
});

server.on('connection', ws => {
	ws.send('Добро пожаловать');
	ws.on('message', message => {
		// отправим всем клиентам
		server.clients.forEach(client => {
		client.send(message);
		});
	});
});