'use strict';

const fs = require('co-fs');
const path = require('path');
const sendfile = require('koa-sendfile');
const router = require('koa-router');
const router_all = router();
const router_user = router();
const router_label = router();
const router_share = router();


router_user.get('/user/getList', function* () {
    yield * sendfile.call(this, path.join(__dirname, 'user/getList.html'));
});
router_user.get('/user/get', function* () {
    yield * sendfile.call(this, path.join(__dirname, 'user/get.html'));
});
router_user.get('/user/put', function* () {
    yield * sendfile.call(this, path.join(__dirname, 'user/put.html'));
});
router_user.get('/user/post', function* () {
    yield * sendfile.call(this, path.join(__dirname, 'user/post.html'));
});

router_label.get('/label/post', function* () {
    yield * sendfile.call(this, path.join(__dirname, 'label/post.html'));
});

router_label.get('/label/get_share', function* () {
    yield * sendfile.call(this, path.join(__dirname, 'label/get_share.html'));
});

router_all.get('/doc/api', function* () {
    yield * sendfile.call(this, path.join(__dirname, 'README.html'));
});

router_all.use('/doc', router_user.routes());
router_all.use('/doc', router_label.routes());
router_all.use('/doc', router_share.routes());


module.exports = router_all;
