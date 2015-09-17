'use strict';
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const config = require('../config.json');
const co = require('co');
const hashword = require('hashword');
const User = require('../models').User;
const debug = require('debug')('app:passport');


passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function (username, password, done) {
    co(function*() {
        const admin = yield User.findOne({username: username});
        debug(admin);
        if (!admin) {
            return done(null, false);
        }
        if (!(hashword.checkPassword(password, admin.passhash))) {
            return done(null, false);
        }
        return done(null, admin);
    }).catch(function (err) {
        done(err);
    });
}));

passport.use(new JWTStrategy({
    secretOrKey: config.jwt.secret,
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
    tokenBodyField: 'bearer',
    tokenQueryParameterName: 'bearer',
    authScheme: 'Bearer',
    passReqToCallback: false
}, function (payload, done) {
    co(function*() {
        const admin = yield User.findById(payload.userId).exec();
        if (!admin) {
            return done(null, false);
        }
        done(null, admin);
    }).catch(function (err) {
        done(err);
    });
}));


module.exports = passport;

