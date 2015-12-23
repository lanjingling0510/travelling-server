
'use strict';

const router = require('koa-router')();
router.use('/reply', require('./reply').routes());
module.exports = router;
