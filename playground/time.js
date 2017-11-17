const moment = require('moment');

// Jan 1st 1970 00:00:00 am

// var date = new Date();
// console.log(date.getMonth());

var date = moment();
// date.add(1, 'years').subtract(11, 'months');
console.log(date.format());
// 'MMM': shorthand version for the current month
// console.log(date.format('MMM Do YYYY h:mm a'));

var someTimeStamp = moment().valueOf();
console.log(someTimeStamp);

date = moment(someTimeStamp);
console.log(date.format('h:mm a'));
