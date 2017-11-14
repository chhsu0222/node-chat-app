/*
initiating the request from client to the server to open up a websocket
and keep that connection open.
*/
var socket = io();

// connect and disconnect are built-in modules (event listener)
socket.on('connect', function () {
  console.log('Connected to server');

  // we don't want to emit the event until we are connected socket.
  socket.emit('createEmail', {
    to: 'jen@example.com',
    text: 'Hey. This is CH.'
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// the argument is the data sent from Server
socket.on('newEmail', function (email) {
  console.log('New email', email);
});
