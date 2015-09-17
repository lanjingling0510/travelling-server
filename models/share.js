'use strict';

const mongoose = require('../common/db').mongoose;
const Schema = mongoose.Schema;

const ShareSchema = Schema({
    text: {type: String, default: null},
    imgs: [String],
    location: [Number],
    city: String,
    place: String,
    score: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    userId: Schema.Types.ObjectId,
    replyCount: {type: Number, default: 0}

}, {collection: 'Shares'});

const Share = mongoose.model('Share', ShareSchema);

module.exports = Share;
