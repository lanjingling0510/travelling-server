'use strict';

const router = require('koa-router')();
router.use('/auth', require('./auth').routes());
router.use('/label', require('./label').routes());
router.use('/reply', require('./reply').routes());
router.use('/share', require('./share').routes());
router.use('/user', require('./user').routes());

module.exports = router;
