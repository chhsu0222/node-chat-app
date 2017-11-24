const path = require('path'); // doesn't need to install since it's a built-in module
const http = require('http'); // doesn't need to install since it's a built-in module
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

// register an event listener with io.on
io.on('connection', (socket) => {
  console.log('New user connected');

  // emit event to client (name, data)
  // socket.emit() emits an event to a single connection

  // event listener
  // add callback to acknowledge that we got that request
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required'); // the argument for 'err'
    }

    socket.join(params.room); // Adding the user to the room
    users.removeUser(socket.id); // remove them from any potential previous rooms
    users.addUser(socket.id, params.name, params.room); // add them to the new one

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // socket.leave('The noame of chat room') -> to leave the room

    // The ways to emit to specific rooms (e.g. 'The Office')
    // io.emit -> io.to('The Office').emit
    // socket.broadcast.emit -> socket.broadcast.to('The Office').emit
    // socket.emit

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      // io.emit() emits an event to every single connection
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
    // broadcasting emits an event to everybody but the current user
    // newMessage event will fire to everybody but myself
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

// app.listen(port, () => {
//   console.log(`Server is up on port ${port}`);
// });

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
