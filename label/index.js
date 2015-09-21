'use strict';

const router = require('koa-router')();
router.use('/label', require('./label').routes());
module.exports = router;
