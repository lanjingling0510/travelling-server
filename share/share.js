'use strict';

const router = require('koa-router')();
const passport = require('../common/passport');
const Model = require('../models');
const Share = Model.Share;
const Label = Model.Label;
const debug = require('debug')('app:share');
const ObjectId = require('mongoose').Types.ObjectId;

/* ================================
 =       create Share
 @api  post  /share
 ================================ */

const createShare = function* () {
    const ctx = this;
    const field = ctx.request.body;
    field.location = field.location.split(',');
    field.labels = field.labels.split(',');
    field.labels = field.labels.map(value => new ObjectId(value));


    //  创建share
    const share = new Share(field);


    try {
        yield share.save();
        ctx.body = '分享成功';
        ctx.status = 200;
    } catch (e) {
        console.log(e);
        ctx.body = e.message;
        ctx.status = 412;
    }
};

/* ================================
 =       find Shares
 @api  get  /share
 ================================ */

const findShares = function* () {
    const ctx = this;
    const query = ctx.query;
    const match = {};

    //  过滤标签分类
    if (query.search && query.keyword) {
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
        debug(e.message);
    }
};


/* ================================
 =       find SharesByDistance
 @api  get  /share/near
 ================================ */

const findSharesByDistance = function* () {
    const ctx = this;
    const query = ctx.query;
    const match = {};
    const center = query.center.split(',');
    const posLeftTop = query.crd1.split(',');
    const posRightBottom = query.crd2.split(',');

    console.log(center);

    //  过滤标签分类
    if (query.search && query.keyword) {
        match[query.search] = query.keyword;
    }

    try {
        const result = yield Share.find({
            location: {
                //  $geoWithin: {
                //    $box: [posLeftTop, posRightBottom]
                //  },
                nearSphere$: center,
                $maxDistance: (posRightBottom - posLeftTop) / 1000 / 6371
            }
        })
            .exec();

        ctx.body = result;
        ctx.status = 200;
    } catch (e) {
        ctx.body = e.message;
        debug(e.message);
    }
};


/* ================================
 =       find Share
 @api  get  /share/123456
 ================================ */

const findShare = function* () {
    const ctx = this;
    const _id = ctx.params._id;
    try {
        const result = yield Share.aggregate()
            .match({_id: new ObjectId(_id)})
            .exec();
        ctx.body = result;
        ctx.status = 200;
    } catch (e) {
        ctx.body = e.message;
        debug(e.message);
    }
};

/* ================================
 =       update Share
 @api  put  /share/123456
 ================================ */

const updateShare = function* () {
    const ctx = this;
    const field = ctx.request.body;
    const _id = ctx.params._id;

    try {
        yield Share.findByIdAndUpdate(_id, field);
        ctx.body = '修改成功';
        ctx.status = 200;
    } catch (e) {
        ctx.body = e.message;
        debug(e.message);
    }
};


/* ================================
 =       remove Share
 @api  delete  /share/123456
 ================================ */

const removeShare = function* () {
    const ctx = this;
    const _id = ctx.params._id;

    try {
        yield Share.findByIdAndRemove(_id);
        ctx.body = '删除成功';
        ctx.status = 200;
    } catch (e) {
        ctx.throw(e.message, 412);
        debug(e.message);
    }
};


router.post('/', createShare);
router.get('/', passport.authenticate('jwt', {session: false}), findShares);
router.get('/near', passport.authenticate('jwt', {session: false}), findSharesByDistance);


router.get('/:_id', passport.authenticate('jwt', {session: false}), findShare);
router.put('/:_id', passport.authenticate('jwt', {session: false}), updateShare);
router.del('/:_id', passport.authenticate('jwt', {session: false}), removeShare);

module.exports = router;
