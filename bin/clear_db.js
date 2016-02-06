const co = require('co');
const Models = require('../models');
const { User, Share, Reply } = Models;

co(function *() {
  yield User.remove();
  yield Share.remove();
  yield Reply.remove();
  console.log('done'); // eslint-disable-line no-console
}).catch(function (err) {
  console.log(err); // eslint-disable-line no-console
  process.exit(1);
});
