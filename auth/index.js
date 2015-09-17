'use strict';

const router = require('koa-router')();
router.use('/auth', require('./auth').routes());
module.exports = router;

