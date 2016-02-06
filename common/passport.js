'use strict';
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const WechatStrategy = require('passport-wechat').Strategy;
const config = require('../config.json');
const co = require('co');
const hashword = require('hashword');
const User = require('../models').User;


passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function (username, password, done) {
  co(function* () {
    const admin = yield User.findOne({
      username: username
    });
    if (!admin) {
      const err = new Error('用户不存在');
      err.name = 'UsernameNotExistsError';
      return done(err, false);
    }
    if (!(hashword.checkPassword(password, admin.passhash))) {
      const err = new Error('密码错误');
      err.name = 'PasswordNotMatchError';
      return done(err, false);
    }
    return done(null, admin);
  }).catch(function (err) {
    done(err);
  });
}));

passport.use('jwt', new JWTStrategy({
  secretOrKey: config.jwt.secret,
  issuer: config.jwt.issuer,
  audience: config.jwt.audience,
  tokenBodyField: 'bearer',
  tokenQueryParameterName: 'bearer',
  authScheme: 'Bearer',
  passReqToCallback: false
}, function (payload, done) {
  co(function* () {
    const admin = yield User.findById(payload.userId).exec();
    if (!admin) {
      return done(null, false);
    }
    done(null, admin);
  }).catch(function (err) {
    done(err);
  });
}));


passport.use('wechat-token', new WechatStrategy({
  appID: config.wechat.appID,
  appSecret: config.wechat.appID,
  name: 'wechat-token',
  client: 'web',
  callbackURL: 'http://www.cyt-rain.cn',
  scope: 'snsapi_userinfo',
  state: 'STATE'
},
  function (accessToken, refreshToken, profile, done) {
    if (!profile) {
      return done(null, false);
    }

    return done(null, profile);
  }
));


module.exports = passport;
