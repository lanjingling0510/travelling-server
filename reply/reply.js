'use strict';

const router = require('koa-router')();
const passport = require('../common/passport');
const Model = require('../models');
const Share = Model.Share;
const Reply = Model.Reply;
const path = require('path');
const debug = require('debug')('app:share');
const ObjectId = require('mongoose').Types.ObjectId;
const config = require('../config.json');

/* ================================
 =       post Reply
 @api  post  /share/123456/reply
 ================================ */

const createReply = function* () {
    const ctx = this;
    const _id = ctx.params._id;
    const field = ctx.request.body;
    let reply = new Reply(field);

    try {
        reply = yield reply.save();
        const share = yield Share.findOne({_id: new ObjectId(_id)}).exec();
        //  计算评分
        share.score = (share.score * share.replys.length + reply.score) / (share.replys.length + 1) | 0;
        //  修改分享
        share.replys.push(new ObjectId(reply._id));
        yield share.save();
        ctx.body = 'success';
        ctx.status = 200;
    } catch (e) {
        ctx.throw(e.message, 412);
    }
};

/* ================================
 =       find Replys
 @api  get  /share/123456/reply
 ================================ */

const findReplys = function* () {
    const ctx = this;
    const _id = ctx.params._id;
    const query = ctx.query;

    try {
        const share = yield Share.findOne({_id: _id})
            .select('replys')
            .exec();

        const replyList = yield Reply.find({_id: {$in: share.replys}})
            .populate('userId', 'nickname')
            .sort({date: -1})
            .skip(query.page * query.limit)
            .limit(Number(query.limit))
            .exec();

        this.body = replyList;
        this.status = 200;
    } catch (e) {
        ctx.throw(e.message, 412);
    }
};

router.post('/', passport.authenticate('jwt', {session: false}), createReply);
router.get('/', findReplys);


module.exports = router;
