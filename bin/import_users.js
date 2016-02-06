'use strict';

const co = require('co');
const User = require('../models').User;
const users = require('./users.data.js');

co(function *() {
  yield users.map(user => {
    return User.create(user);
  });

  console.log('done'); // eslint-disable-line no-console
}).catch(function (err) {
  console.log(err); // eslint-disable-line no-console
  process.exit(1);
});
