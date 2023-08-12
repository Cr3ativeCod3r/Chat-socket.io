import {io} from "socket.io-client"

const socket = io('http://192.168.15.109:8081')

//const joinRoomButton = document.getElementById("room-button");
const roomSelect = document.getElementById("room-input");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");

messageInput.setAttribute("autocomplete", "off");
const userSocket = io('http://192.168.15.109:8081', {auth: {token: "Test"}})


userSocket.on('connect_error', error =>{
    displayMessage(error)
})
//back
socket.on('connect', () => {
    //displayMessage(`You connected with id: ${socket.id}`); // Change $socket.id to socket.id
});


socket.on('receive-message', message => {
    displayHisMessage(message)
})


// back and front
form.addEventListener("submit", e => {
    e.preventDefault();
    const message = messageInput.value;
    const room = roomInput.value;

    if (message === "") return
    displayMessage(message);
    socket.emit('send-message', message, room)
    messageInput.value = '';
    

});












//backend
roomSelect.addEventListener("change", () => {
    const selectedOption = roomSelect.options[roomSelect.selectedIndex];
    const room = selectedOption.value;
    socket.emit("join-room", room, message =>{
        //displayMessage(message)
    })
});

















//front
function displayMessage(message) {
    const my = document.getElementById("message-container");
  
    // Tworzenie nowego elementu div
    const divHandle = document.createElement("div");
    divHandle.className = "handle";
  
    // Tworzenie nowego elementu div
    const divMy = document.createElement("div");
    divMy.className = "my";
    divMy.textContent = message;
  
    // Dodawanie elementów do struktury DOM
    divHandle.appendChild(divMy);
    my.appendChild(divHandle);
  
    const messageWidth = message.length * 10; 
    divMy.style.width = messageWidth + "px";
  
    // Automatyczne przewijanie do ostatniej wiadomości
    my.scrollTop = my.scrollHeight - my.clientHeight;
  }
  

  function displayHisMessage(message) {
    const my = document.getElementById("message-container");
  
    // Tworzenie nowego elementu div
    const divHandle = document.createElement("div");
    divHandle.className = "handle";
  
    // Tworzenie nowego elementu div
    const divMy = document.createElement("div");
    divMy.className = "his";
    divMy.textContent = message;
  
    // Dodawanie elementów do struktury DOM
    divHandle.appendChild(divMy);
    my.appendChild(divHandle);
  
    const messageWidth = message.length * 10; 
    divMy.style.width = messageWidth + "px";
  
    // Automatyczne przewijanie do ostatniej wiadomości
    my.scrollTop = my.scrollHeight - my.clientHeight;
  }

let count = 0
setInterval(() => {
    socket.emit('ping', ++count)
}, 1000)
document.addEventListener('keydown', e => {
    if(e.target.matches('input')) return

    if(e.key === 'c') socket.connect()
    if(e.key === 'd') socket.disconnect()
})

