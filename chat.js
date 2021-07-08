const socket = new WebSocket(`ws://localhost:3000`);
const users = new Set;

const logIn = () => {
	const loginForm = document.getElementById('login-form');
	const user = loginForm.querySelector('input');
	const currentUser = document.getElementById('currentUser');

	loginForm.addEventListener('submit', e => {
		e.preventDefault();

		const name = user.value;

		socket.send(JSON.stringify({
			type: 'hello', 
			data: { name }
		}));
		socket.addEventListener('message', e => getMessageFromServer(JSON.parse(e.data)));

		login.classList.toggle('hidden');
		chat.classList.toggle('hidden');

		currentUser.textContent = name;

		changeAvatar();
	})
}

const getMessageFromServer = ({ type, name, data }) => {
	switch (type) {
		case 'hello':
			users.add(name);
			printClients();
			addSystemMessage(`Пользователь ${name} вошел в чат`);
			break;
		case 'user-list':
			data.forEach(item => {
				users.add(item);
				printClients();
			})
			break;
		case 'bye':
			users.delete(name);
			printClients();
			addSystemMessage(`Пользователь ${name} покинул чат`);
			break;
		case 'text':
			addMessageToChat(name, data.message)
			break;
	}
}

const addSystemMessage = message => {
	const messages = document.getElementById('messages');
	const div = document.createElement('div');

	div.classList.add('chat-area__item', 'chat-area__item_system');
	div.textContent = message;

	messages.appendChild(div);
	messages.scrollTop = messages.scrollHeight;
}

const addMessageToChat = (name, text) => {
	const messages = document.getElementById('messages');
	const date = new Date();
	const hours = String(date.getHours()).padStart(2, 0);
	const minutes = String(date.getMinutes()).padStart(2, 0);
	const time = `${hours}:${minutes}`;
	const div = document.createElement('div');

	div.classList.add('chat-area__item');
	div.innerHTML = `
		<div class="chat-area__photo"></div>
		<div class="chat-area__message message">
			<div class="message__name">${name}</div>
			<div class="message__block">
				<span class="message__text">${text}</span>
				<span class="message__time">${time}</span>
			</div>
		</div>
	`;

	messages.appendChild(div);
	messages.scrollTop = messages.scrollHeight;
}

const printClients = () => {
	const userList = document.getElementById('list');
	const fragment = document.createDocumentFragment();

	userList.innerHTML = '';

	[...users].forEach(name => {
		const li = document.createElement('li');
		li.classList.add('clients__item');
		li.innerHTML = `
			<div class="clients__image-wrap clients__image-wrap_list"></div>
			<div class="clients__name">${name}</div>
		`;
		fragment.appendChild(li);
	})

	userList.appendChild(fragment);

	sanitizeClients();
}

const changeAvatar = () => {
	const imageWrap =  document.getElementById('image-wrap')
	const loadAvatar = document.getElementById('loadAvatar');
	const fileReader = new FileReader();
	const avatar = document.createElement('img');

	avatar.classList.add('img', 'clients__img');

	loadAvatar.addEventListener('change', e => {
		imageWrap.appendChild(avatar);
		
		const [file] = e.target.files;

		fileReader.readAsDataURL(file);
	});

	fileReader.addEventListener('load', () => {
		avatar.src = fileReader.result;
	});
}

// const declination = quantity => { 
// 	const textArr = ['участник', 'участника', 'участников']
// 	const mod100 = quantity % 100; 
// 	const mod10 = n % 10;

// 	if (mod100 > 10 && mod100 < 20) return textArr[2];
// 	if (mod10 > 1 && mod10 < 5) return textArr[1];
// 	if (mod10 == 1) return textArr[0];

// 	return `${mod100} textArr[2]`;
// }

const sendMessage = () => {
	const sendForm = document.getElementById('send-form');
	const sendInput = sendForm.querySelector('input');

	sendForm.addEventListener('submit', e => {
		e.preventDefault();

		const message = sendInput.value;
		
		if (message) {
			socket.send(JSON.stringify({
				type: 'text', 
				data: { message }
			}))
		}

		sendInput.value = '';
	})
}

const sanitizeClients = () => {
	const userList = document.getElementById('list');
	const currentUser = document.getElementById('currentUser');

	for (const item of userList.children) {

		if (item.children[1].textContent === currentUser.textContent) {
			item.remove();
		}
	}
}

logIn();
sendMessage();
