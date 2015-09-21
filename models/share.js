'use strict';

const mongoose = require('../common/db').mongoose;
const Schema = mongoose.Schema;

const ShareSchema = Schema({
    text: String,
    imgs: {type: [String], default: []},
    location: {type: [Number], index: '2d'},
    labels: [{
        type: Schema.Types.ObjectId,
        ref: 'Label'
    }],
    city: String,
    place: String,
    score: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    userId: Schema.Types.ObjectId,
    replys: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Reply'
    }

}, {collection: 'Shares', versionKey: false});


const Share = mongoose.model('Share', ShareSchema);

module.exports = Share;
