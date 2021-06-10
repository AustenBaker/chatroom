const $window = $(window);
const $loginScreen = $('.login.screen');
const $chatScreen = $('.chat.screen');
const $usernameInput = $('#usernameInput'); // username input
const $messages = $('#messages');           // Messages area
const $inputMessage = $('#inputMessage');   // Input message input box


const socket = io();

let username;
let $currentInput = $usernameInput.focus();

const setUsername = () => {
  username = $usernameInput.val().trim();

  if (username) {
    $loginScreen.fadeOut();
    $chatScreen.show();
    $loginScreen.off('click');
    $currentInput = $inputMessage.focus();

    //tell server username
    socket.emit('add user', username);
  }
}

const sendMessage = () => {
  let message = $inputMessage.val();
  
  // if there is a non-empty message and a socket connection
  if (message) {
    $inputMessage.val('');
    addChatMessage({ username, message });

    // tell server to execute 'chat message' and send along one parameter
    socket.emit('chat message', message);
  }
}

const log = (message, options) => {
  const $el = $('<li>').addClass('log').text(message);
  $messages.append($el);
}

const addChatMessage = (data, options = {}) => {
  const $usernameDiv = $('<span class="username"/>')
    .text(data.username)
  const $messageBodyDiv = $('<span class="messageBody">')
    .text(data.message);

  const $messageDiv = $('<li class="message"/>')
    .data('username', data.username)
    .append($usernameDiv, $messageBodyDiv);
  
  
  $messages.append($messageDiv);
}


// when server emits 'chat message', add it
socket.on('chat message', (data) => {
  addChatMessage(data);
})

// server emits 'user joined', log to chat
socket.on('user joined', (data) =>{
  log(`${data.username} joined`);
});

// server emits 'user left', log to chat
socket.on('user left', (data) => {
  log(`${data.username} left`);
});

$window.keydown(event => {
  // When client hits ENTER on keyboard
  if (event.which === 13) {
    if (username) {
      sendMessage();
    } else {
      setUsername();
    }
  }
});