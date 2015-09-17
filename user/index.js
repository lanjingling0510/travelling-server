'use strict';

const router = require('koa-router')();
router.use('/user', require('./user').routes());
module.exports = router;

