const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'CH';
    var text = 'Hey. What is going on?';
    var message = generateMessage(from, text);
    // expect(message.from).toBe(from);
    // expect(message.text).toBe(text);
    expect(message).toMatchObject({
      from,
      text
    });
    expect(typeof message.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'Garfield';
    var latitude = 12;
    var longitude = 15;
    var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    var message = generateLocationMessage(from, latitude, longitude);
    // expect(message.from).toBe(from);
    // expect(message.url).toBe(url);
    expect(message).toMatchObject({from, url});
    expect(typeof message.createdAt).toBe('number');
  });
});
