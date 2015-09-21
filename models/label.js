'use strict';

const mongoose = require('../common/db').mongoose;
const Schema = mongoose.Schema;

const LabelSchema = Schema({
    content: String
}, {collection: 'Labels', versionKey:false});

const Label = mongoose.model('Label', LabelSchema);
module.exports = Label;
