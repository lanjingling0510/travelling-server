'use strict';

const mongoose = require('../common/db').mongoose;
const Schema = mongoose.Schema;

const ShareSchema = Schema({
    text: String,
    images: {type: [String], default: []},
    coordinates: {type: [Number], index: '2d'},
    labels: [{
        type: Schema.Types.ObjectId,
        ref: 'Label'
    }],
    city: String,
    place: String,
    score: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    replys: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    }],
    favorited: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {collection: 'Shares', versionKey: false});


const Share = mongoose.model('Share', ShareSchema);

module.exports = Share;
