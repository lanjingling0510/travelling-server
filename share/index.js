
'use strict';

const router = require('koa-router')();
router.use('/share', require('./share').routes());
module.exports = router;
