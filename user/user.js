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
    const password = ctx.request.body.password;
    try {
        if (!(/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/.test(password))) {
            throw new Error('密码长度为6-22!');
        }

        const user = {
            username: ctx.request.body.username,
            passhash: hashword.hashPassword(password),
            updatedAt: new Date()
        };

        yield User.createUser(user);
        ctx.body = '注册成功';
        ctx.status = 200;
    } catch (e) {
        ctx.body = e.message;
        ctx.status = 412;
    }
};


/* ================================
 =       find Users
 @api  get  /user
 ================================ */

const findUsers = function* () {
    const ctx = this;
    const query = ctx.query;
    const match = {};

    if (query.search) {
        match[query.search] = query.keyword;
    }

    try {
        const result = yield User.aggregate()
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
        const result = yield User.aggregate()
            .match({_id: new ObjectId(_id)})
            .exec();
        ctx.body = result;
        ctx.status = 200;
    } catch (e) {
        ctx.body = e.message;
        ctx.status = 412;
        debug(e.message);
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
    const password = field.password;

    try {
        if (password && !(/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/.test(password))) {
            throw new Error('密码长度为6-22!');
        }

        password && (field.passhash = hashword.hashPassword(password));
        yield User.updateUser({_id: _id}, field);
        ctx.body = '修改成功';
        ctx.status = 200;
    } catch (e) {
        ctx.body = e.message;
        ctx.status = 412;
        debug(e.message);
    }
};


router.post('/', createUser);
router.get('/', passport.authenticate('jwt', {session: false}), findUsers);

router.get('/:_id', passport.authenticate('jwt', {session: false}), findUser);
router.put('/:_id', passport.authenticate('jwt', {session: false}), updateUser);


module.exports = router;
