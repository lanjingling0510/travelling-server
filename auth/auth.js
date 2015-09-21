'use strict';

const router = require('koa-router')();
const passport = require('../common/passport');
const config = require('../config.json');
const jwt = require('jsonwebtoken');

// 通过用户名密码换取token，使用JSON Web Token
const exchangeToken = function* () {
    const ctx = this;
    const user = ctx.req.user;
    const payload = {
        userId: user._id.toString(),
        type: user.type
    };
    const secret = config.jwt.secret;
    const options = {
        algorithm: config.jwt.algorithm,
        expiresInMinutes: config.jwt.expires_in_minutes,
        audience: config.jwt.audience,
        subject: config.jwt.subject,
        issuer: config.jwt.issuer,
        noTimestamp: false,
        headers: {}
    };

    const userJWT = jwt.sign(payload, secret, options);
    this.body = {
        access_token: userJWT
    };
};


// 获取登陆用户的信息
const fetchAdminProfile = function* () {
    const user = this.req.user;
    this.body = {
        _id: user._id,
        id: user._id,
        username: user.username,
        type: user.type
    };
};


router.post('/token', passport.authenticate('local', {
    session: false
}), exchangeToken);

router.get('/profile', passport.authenticate('jwt', {
    session: false
}), fetchAdminProfile);

module.exports = router;
