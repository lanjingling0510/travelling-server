'use strict';

const router = require('koa-router')();
const passport = require('../common/passport');
const User = require('../models').Share;
const debug = require('debug')('app:share');
const ObjectId = require('mongoose').Types.ObjectId;

/* ================================
 =       create Share
 @api  post  /share
 ================================ */

const createShare = function () {
    const ctx = this;

};


router.post('/', createShare);
router.get('/', passport.authenticate('jwt', {session: false}), findShares);

router.get('/:_id', passport.authenticate('jwt', {session: false}), findShare);
router.put('/:_id', passport.authenticate('jwt', {session: false}), updateShare);


module.exports = router;
