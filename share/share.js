'use strict';

const router = require('koa-router')();
const passport = require('../common/passport');
const Model = require('../models');
const Share = Model.Share;
const Reply = Model.Reply;
const User = Model.User;
const path = require('path');
const url = require('url');
const fs = require('co-fs');
const debug = require('debug')('app:share');
const ObjectId = require('mongoose').Types.ObjectId;
const config = require('../config.json');

/* ================================
 =       create Share
 @api  post  /share
 ================================ */

const createShare = function* () {
    const ctx = this;
    const field = ctx.request.body;


    try {
        //  移动上传的图片
        const images = field.images;

        for (let i = 0; i < images.length; i++) {
            const destName = path.basename(images[i]);
            const sourcePath = path.join(config.upload.root, config.upload.tempPath, destName);
            const destPath = path.join(config.upload.root, config.upload.uploadPath, destName);
            yield fs.rename(sourcePath, destPath);
            images[i] = url.resolve(config.jwt.audience, config.upload.uploadPath + '/' + destName);
        }

        //  创建share
        let share = new Share(field);
        share = yield share.save();

        //  修改user集合
        yield User.findByIdAndUpdate(field.userId, {$push: {shares: {$each: [new ObjectId(share._id)], $position: 0}}});

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

    //  ============================
    //  分类
    //  ============================

    // 分类：区域
    if (query.sw && query.ne) {
        const sw = query.sw.split(',').map(value => parseFloat(value));
        const ne = query.ne.split(',').map(value => parseFloat(value));
        match.coordinates = {
            $geoWithin: {
                $box: [[sw[0], sw[1]], [ne[0], ne[1]]]
            }
        };
    }

    // 分类: 标签
    if (query.label) {
        match.labels = {
            $in: [new ObjectId(query.label)]
        };
    }

    // 分类: 用户
    if (query.userId) {
        match.userId = query.userId;
    }


    try {
        const result = yield Share
            .find(match)
            .sort({[query.orderBy]: query.order})
            .skip(query.limit * query.page)
            .limit(Number(query.limit))
            .exec();

        ctx.body = result;
        ctx.status = 200;
    } catch (e) {
        debug(e.message);
        ctx.throw(e.message, 412);
    }
};


/* ================================
 =       find SharesByDistance
 @api  get  /share/near
 ================================ */

const findSharesByDistance = function* () {
    const ctx = this;
    const query = ctx.query;
    const center = query.center.split(',').map(value => parseFloat(value));
    const sw = query.sw.split(',').map(value => parseFloat(value));
    const ne = query.ne.split(',').map(value => parseFloat(value));
    const match = {};

    //  ============================
    //  分类
    //  ============================

    // 分类：区域面积 远近距离
    if (query.sw && query.ne) {
        match.coordinates = {
            $near: center,
            $maxDistance: ne[1] - sw[1]
        };
    }

    // 分类: 标签
    if (query.label) {
        match.labels = {
            $in: [new ObjectId(query.label)]
        };
    }

    // 分类: 用户
    if (query.userId) {
        match.userId = query.userId;
    }


    try {
        //const result = yield Share.aggregate([
        //    {
        //        $geoNear: {
        //            near: center,
        //            distanceField: 'distance',
        //            maxDistance: (ne[0] - sw[0]),
        //            query: match,
        //            num: query.limit,
        //            uniqueDocs: true
        //        }
        //    }
        //]).exec();

        const result = yield Share
            .find(match)
            .skip(query.limit * query.page)
            .limit(Number(query.limit))
            .exec();

        ctx.body = result;
        ctx.status = 200;
    } catch (e) {
        debug(e.message);
        ctx.throw(e.message, 412);
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
        const result = yield Share.findById(_id)
            .populate('userId', 'nickname')     //  引用user集合返回nickname字段
            .select('_id city date images place score text userId')
            .exec();
        ctx.body = result;
        ctx.status = 200;
    } catch (e) {
        ctx.throw(e.message, 412);
        debug(e.message);
    }
};

/* ================================
 =       collect Share
 @api  put  /share/123456/collect
 ================================ */

const collectShare = function* () {
    const ctx = this;
    const field = ctx.request.body;
    const _id = ctx.params._id;

    try {
        const promises = [
            Share.findByIdAndUpdate(_id, {
                $push: {favorited: {$each: [field.userId], $position: 0}}
            }),
            User.findByIdAndUpdate(field.userId, {
                $push: {collections: {$each: [_id], $position: 0}}
            })
        ];
        yield promises;

        ctx.body = 'collect';
        ctx.status = 200;
    } catch (e) {
        ctx.throw(e.message, 412);
    }
};

/* ================================
 =       uncollect Share
 @api  put  /share/123456/uncollect
 ================================ */

const uncollectShare = function* () {
    const ctx = this;
    const _id = ctx.params._id;
    const field = ctx.request.body;

    try {
        const promises = [
            Share.findByIdAndUpdate(_id, {
                $pull: {favorited: field.userId}
            }),
            User.findByIdAndUpdate(field.userId, {
                $pull: {collections: _id}
            })
        ];
        yield promises;

        ctx.body = 'uncollect';
        ctx.status = 200;
    } catch (e) {
        ctx.throw(e.message, 412);
    }
};

/* ================================
 =       judgecollect Share
 @api  get  /share/123456/judgecollect
 ================================ */

const judgecollect = function* () {
    const ctx = this;
    const _id = ctx.params._id;
    const userId = ctx.query.userId;
    try {
        const share = yield Share.find({_id: _id, favorited: {$in: [userId]}});
        if (share.length === 0) ctx.body = 'uncollect';
        else ctx.body = 'collect';
    } catch (e) {
        ctx.throw(e.message, 412);
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
        const share = yield Share.findByIdAndRemove(_id);// 删除分享

        const promise2 = [
            User.update({collections: {$in: [_id]}}, {$pull: {collections: _id}}),//  从其他用户的收藏列表中清除
            User.findByIdAndUpdate(share.userId, {$pull: {shares: _id}}),//  从发布者的分享列表中清除
            Promise.all(share.replys.map(value => Reply.findByIdAndRemove(value)))//  删除相关的评论
        ];

        yield promise2;

        ctx.body = '删除成功';
        ctx.status = 200;
    } catch (e) {
        ctx.throw(e.message, 412);
        debug(e.message);
    }
};


router.post('/', passport.authenticate('jwt', {session: false}), createShare);
router.get('/', findShares);
router.get('/near', findSharesByDistance);

router.get('/:_id', findShare);
router.get('/:_id/judgecollect', judgecollect);
router.put('/:_id/collect', passport.authenticate('jwt', {session: false}), collectShare);
router.put('/:_id/uncollect', passport.authenticate('jwt', {session: false}), uncollectShare);
router.del('/:_id', passport.authenticate('jwt', {session: false}), removeShare);

//  获得分享评论
router.use('/:_id', require('../reply').routes());

module.exports = router;
