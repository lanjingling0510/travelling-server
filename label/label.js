'use strict';

const router = require('koa-router')();
const passport = require('../common/passport');
const model = require('../models');
const Label = model.Label;
const Share = model.Share;
const debug = require('debug')('app:label');
const ObjectId = require('mongoose').Types.ObjectId;


/* ================================
 =       create Label
 @api  post  /label
 ================================ */

const createLabel = function* () {
    debug('post   /label');
    const ctx = this;
    const label = ctx.request.body;
    try {
        yield Label.create(label);
        ctx.body = '添加标签成功';
        ctx.status = 200;
    } catch (e) {
        ctx.body = e.message;
        ctx.status = 412;
    }
};

const getLabels = function*() {
    const ctx = this;
    try {
        const labelList = yield Label.find();
        ctx.body = labelList;
    } catch (e) {
        ctx.body = e.message;
        ctx.status = 412;
    }
};


/* ================================
 =       get Share
 @api  get  /label/123456/share
 ================================ */

const findSharesByLabel = function* () {
    debug('get   /label/123456/share');
    const ctx = this;
    const labelId = ctx.params._id;
    const query = ctx.query;
    const match = {labels: new ObjectId(labelId)};

    if (query.search) {
        match[query.search] = query.keyword;
    }

    try {
        const result = yield Share.aggregate()
            .match(match)
            .sort({[query.orderBy]: query.order})
            .skip(query.page * query.limit)
            .limit(Number(query.limit))
            .exec();


        ctx.body = result;
        ctx.status = 200;
    } catch (e) {
        ctx.body = e.message;
        ctx.status = 412;
    }
};


router.get('/', getLabels);
router.post('/', passport.authenticate('jwt', {session: false}), createLabel);
router.get('/:_id/share', passport.authenticate('jwt', {session: false}), findSharesByLabel);

module.exports = router;
