const path = require('path'); // doesn't need to install since it's a built-in module
const http = require('http'); // doesn't need to install since it's a built-in module
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// register an event listener with io.on
io.on('connection', (socket) => {
  console.log('New user connected');

  // emit event to client (name, data)
  // socket.emit() emits an event to a single connection
  // socket.emit('newMessage', {
  //   from: 'John',
  //   text: 'See you then',
  //   createdAt: 123123
  // });

  // event listener
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);

    // io.emit() emots an event to every single connection
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

// app.listen(port, () => {
//   console.log(`Server is up on port ${port}`);
// });

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
