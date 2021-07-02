const WebSocket = require('ws');
const server = new WebSocket.Server({
	port: 3000,
});

/*
let clients = [];

server.on('connection', ws => {
	ws.on('message', message => {
		const data = JSON.parse(message);

		if (data.type === 'hello') {
			clients.unshift(data.name);
			let uniqueClients = new Set(clients)
			data.clients = [...uniqueClients];
		} else if (data.type === 'bye') {
			clients.splice(clients.indexOf(data.name), 1);
		}
		server.clients.forEach(client => {
			client.send(JSON.stringify(data));
		});
	});

	ws.on('close', () => {
		server.clients.send(JSON.stringify({type:'bye', name: '', text: 'Кто-то вышел из чата'}))
	})
});

*/

server.on('connection', ws => {
	ws.send('Добро пожаловать');
	ws.on('message', message => {
	  // отправим всем клиентам
	
	  server.clients.forEach(client => {
		 client.send(message);
	  });
	});
	ws.on('close', () => {
		server.clients.forEach(client => {
			client.send('Кто-то вышел');
		});
	})
 });

