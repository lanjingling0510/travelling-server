'use strict';

const mongoose = require('../common/db').mongoose;
const Schema = mongoose.Schema;

const LabelSchema = Schema({
    image: String,
    name: String,
    selected: {type: Boolean, default: false}
}, {collection: 'Labels', versionKey: false});

const Label = mongoose.model('Label', LabelSchema);
module.exports = Label;
