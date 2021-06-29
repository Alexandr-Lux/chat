const app = document.getElementById('app');
const form = document.getElementById('form');
const input = form.querySelector('input');

const printMessage = message => {
	const paragraph = document.createElement('p');
	paragraph.textContent = message;
	app.append(paragraph);
};

const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', () => {
	console.log('ONLINE');
});

socket.addEventListener('close', () => {
	console.log('DISCONNECTED');
});

socket.addEventListener('message', response => {
	printMessage(response.data);
});

form.addEventListener('submit', evt => {
	evt.preventDefault();
	socket.send(input.value);
	input.value = '';
});