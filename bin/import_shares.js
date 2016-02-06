'use strict';

const co = require('co');
const Share = require('../models').Share;
const shares = require('./shares.data.js');

co(function *() {
  yield shares.map(share => {
    return Share.create(share);
  });

  console.log('done'); // eslint-disable-line no-console
}).catch(function (err) {
  console.log(err); // eslint-disable-line no-console
  process.exit(1);
});
