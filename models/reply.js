'use strict';

const mongoose = require('../common/db').mongoose;
const Schema = mongoose.Schema;

const ReplySchema = Schema({
    text: String,
    date: {type: Date, default: Date.now},
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    score: Number
}, {collection: 'Replys', versionKey: false});

const Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;
