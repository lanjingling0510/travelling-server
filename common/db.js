'use strict';

const config = require('../config.json');
const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect(config.mongoose.url);

db.on('error', (err) => {
    console.log('mongodb connection error:%s', err);
});

mongoose.set('debug', config.mongoose.debug);
exports.mongoose = mongoose;
