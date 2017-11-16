/*
initiating the request from client to the server to open up a websocket
and keep that connection open.
*/
var socket = io();

// connect and disconnect are built-in modules (event listener)
socket.on('connect', function () {
  console.log('Connected to server');

  // we don't want to emit the event until we are connected socket.
  // socket.emit('createMessage', {
  //   from: 'Kevin',
  //   text: 'Hello.'
  // });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// the argument is the data sent from Server
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li); // add it as its last child
});

// add acknowledgement to the client
// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'Hi'
// }, function (data) {
//   console.log('Got it', data);
// });

jQuery('#message-form').on('submit', function (e) {
  /*
  Default action will go through a full refresh then it's going to
  add to the data as a query on the string URL.
  e.g. localhost:3000/?message=Test
  */
  e.preventDefault(); // e is short of event

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location');
  });
});
