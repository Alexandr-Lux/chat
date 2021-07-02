const messages = document.getElementById('messages');
const form = document.getElementById('form');
const chatInput = form.querySelector('input');
const login = document.getElementById('login');
const chat = document.getElementById('chat');
const loginInput = login.querySelector('input');
const loginForm = document.getElementById('login-form');
const currentUser = document.getElementById('currentUser');
const clientsList = document.getElementById('list');
const countOfUsers = document.getElementById('count-of-users');

let users = [];

const changeStatus = () => {
	login.classList.toggle('hidden');
	chat.classList.toggle('hidden');
}

const declOfNum = n => { 
	const textArr = ['участник', 'участника', 'участников']
	n = Math.abs(n) % 100; 
	const n1 = n % 10;
	if (n > 10 && n < 20) { return textArr[2]; }
	if (n1 > 1 && n1 < 5) { return textArr[1]; }
	if (n1 == 1) { return textArr[0]; }
	return `${n} textArr[2]`;
}

const printMessage = message => {
	const messageWrapper = document.createElement('div');
	const received = JSON.parse(message);

	if (received.type === ('hello' || 'bye')) {
		if (currentUser.textContent === received.name) {
			return
		} else {
			messageWrapper.textContent = received.text
		};
	};

	messageWrapper.textContent = received.text;
	messages.appendChild(messageWrapper);
};

const toSend = (type, name, text) => {
	let newMessage = {
		type: type,
		name: name,
		text: text,
	};
	return JSON.stringify(newMessage)
}

const updateClients = (serverMessage) => {
	const received = JSON.parse(serverMessage);

	if (received.type === 'hello') {

		const clients = received.clients;
		console.log(clients.length);

		clients.forEach(el => {
			if (el !== currentUser.textContent) {
				const client = document.createElement('li');
				client.classList.add('clients__member');
				client.innerHTML = `
					<div class="clients__image-wrap">
						<img class="clients__img" src="./images/client-no-image.svg" alt="no-photo-client">
					</div>
					<span class="clients__name" id="currentUser">${el}</span>
				`;
				users.push(el);
				clientsList.appendChild(client);
			}
		})
	}
}

loginForm.addEventListener('submit', e => {
	e.preventDefault();

	let name = loginInput.value;

	if (name !== '') {
		const socket = new WebSocket('ws://localhost:3000');

		socket.addEventListener('open', () => {
			socket.send(toSend('hello', name, `Пользователь ${name} вошел в чат`))
		});

		socket.addEventListener('close', () => {
			socket.send(toSend('bye', currentUser.textContent, `Пользователь ${name} покинул чат`))
		});

		socket.addEventListener('message', response => {
			printMessage(response.data);
			updateClients(response.data);
			console.log(JSON.parse(response.data).clients);
		});

		form.addEventListener('submit', e => {
			e.preventDefault();
			socket.send(toSend('text', name, chatInput.value));
			chatInput.value = '';
			console.log(currentUser.textContent);
		});

		changeStatus();
		currentUser.textContent = name;

	} else {
		alert('Введите ник')
	}
})



// ==================== УПРОЩЕННАЯ МОДЕЛЬ ==============================
/*

const printMessage = message => {
	const messageWrapper = document.createElement('div');
	messageWrapper.textContent = message;
	messages.appendChild(messageWrapper);
};

loginForm.addEventListener('submit', e => {
	e.preventDefault();

	let name = loginInput.value;

	if (name !== '') {
		const socket = new WebSocket('ws://localhost:3000');

		socket.addEventListener('open', () => {
			socket.send(`Пользователь ${name} вошел в чат`)
		});

		socket.addEventListener('close', () => {
			socket.send(`Пользователь ${name} покинул чат`)
		});

		socket.addEventListener('message', response => {
			printMessage(response.data);
		});

		form.addEventListener('submit', e => {
			e.preventDefault();
			socket.send(toSend('text', name, chatInput.value));
			chatInput.value = '';
			console.log(currentUser.textContent);
		});

		login.classList.toggle('hidden');
		chat.classList.toggle('hidden');
		currentUser.textContent = name;

	} else {
		alert('Введите ник')
	}
})
*/