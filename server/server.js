const path = require('path'); // doesn't need to install since it's a built-in module
const http = require('http'); // doesn't need to install since it's a built-in module
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
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

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user jioned'));

  // event listener
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);

    // io.emit() emits an event to every single connection
    io.emit('newMessage', generateMessage(message.from, message.text));

    // broadcasting emits an event to everybody but one specific user
    // newMessage event will fire to everybody but myself
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text:message.text,
    //   createdAt: new Date().getTime()
    // });
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
