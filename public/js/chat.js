/*
initiating the request from client to the server to open up a websocket
and keep that connection open.
*/
var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  var clientHeight = messages.prop('clientHeight'); // prop gives us a cross-browser way to fech a property
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  // the height of the 2nd to last message
  var lastMessageHeight = newMessage.prev().innerHeight(); // move to the previous child

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    // console.log('should scroll !!!');
    messages.scrollTop(scrollHeight); // set vertical scrollbar position
  }
}

// connect and disconnect are built-in modules (event listener)
socket.on('connect', function () {
  console.log('Connected to server');

  /*
  location is a global object which is provided by your browser.
  search is the query string.
  jQuery.param creates a serialized representation of an array or an object.
  The serialized values can be used in the URL query string
  when making an AJAX request.
  */
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      // send the user back to the root page
      window.location.href = '/';
    } else {
      console.log('no error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// the argument is the data sent from Server
socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html(); // .html() to get its inner HTML back
  // Mustache.render(template, data_you_want_to_render_into_the_template)
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var tamplate = jQuery('#location-message-template').html();
  var html = Mustache.render(tamplate, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  })

  jQuery('#messages').append(html);
  scrollToBottom();
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

  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val(''); // clear the input field
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Sending location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Sending location');
    alert('Unable to fetch location');
  });
});
