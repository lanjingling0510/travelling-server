
'use strict';

const router = require('koa-router')();
router.use('/upload', require('./upload').routes());
module.exports = router;

