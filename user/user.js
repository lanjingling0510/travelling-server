'use strict';

const router = require('koa-router')();
const passport = require('../common/passport');
const User = require('../models').User;
const hashword = require('hashword');
const debug = require('debug')('app:user');
const ObjectId = require('mongoose').Types.ObjectId;


/* ================================
 =       create User
 @api  post  /user
 ================================ */

const createUser = function* () {
    const ctx = this;

    //if (ctx.request.body.password)

    const user = {
        username: ctx.request.body.username,
        passhash: hashword.hashPassword(ctx.request.body.password),
        updatedAt: new Date()
    };


    try {
        const result = yield User.create(user);
        ctx.body = '注册成功';
        ctx.status = 200;
    } catch (e) {
        if (e.code === 11000) {
            ctx.body = '账号重复';
            ctx.status = 409;
        } else {
            ctx.body = e.message;
            ctx.status = 412;
        }
    }
};


/* ================================
 =       update User
 @api  put  /user/123456
 ================================ */

const updateUser = function* () {
    const ctx = this;
    const field = ctx.request.body;
    const _id = ctx.params._id;
    try {
        const result = yield User.findByIdAndUpdate(_id, {$set: field});
        ctx.body = '修改成功';
        ctx.status = 200;
    } catch (e) {
        ctx.body = '修改错误';
        debug(e.message);
    }
};

/* ================================
 =       find Users
 @api  get  /user
 ================================ */

const findUsers = function* () {
    const ctx = this;
    try {
        const result = yield User.aggregate({$match: {}}).exec();
        ctx.body = result;
        ctx.status = 200;
    } catch (e) {
        ctx.body = '查询失败';
        debug(e.message);
    }
};

/* ================================
 =       find User
 @api  get  /user/123456
 ================================ */

const findUser = function* () {
    const ctx = this;
    const _id = ctx.params._id;
    try {
        const result = yield User.aggregate().match({_id: new ObjectId(_id)}).exec();
        ctx.body = result;
        ctx.status = 200;
    } catch (e) {
        ctx.body = '查询失败';
        debug(e.message);
    }
};

router.post('/', createUser);
router.get('/', passport.authenticate('jwt', {session: false}), findUsers);

router.get('/:_id', passport.authenticate('jwt', {session: false}), findUser);
router.put('/:_id', passport.authenticate('jwt', {session: false}), updateUser);


module.exports = router;
