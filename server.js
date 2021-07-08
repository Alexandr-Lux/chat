const { Server } = require('ws');

const wsServer = new Server({ port: 3000 });

const users = new Map;

wsServer.on('connection', ws => {
	users.set(ws, {});

	ws.on('message', message => {
		const messageObj = JSON.parse(message);
		let excludeItself = false;

		if (messageObj.type === 'hello') {
			excludeItself = true;
			users.get(ws).userName = messageObj.data.name;
			ws.send(JSON.stringify({
				type: 'user-list',
				data: [...users.values()].map(item => item.userName)
			}))
		}

		sendMessage(users, messageObj, ws, excludeItself)
	})

	ws.on('close', () => {
		sendMessage(users, { type: 'bye' }, ws);
		users.delete(ws);
	})
})

const sendMessage = (users, message, currentSocket, excludeSelf) => {
	const wsData = users.get(currentSocket);

	if (wsData) {
		message.name = wsData.userName;

		for (const user of users.keys()) {
			if (user === currentSocket && excludeSelf) {
				continue;
			}

			user.send(JSON.stringify(message));
		}
	}
}
