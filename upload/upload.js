'use strict';

const router = require('koa-router')();
const passport = require('../common/passport');
const ObjectId = require('mongoose').Types.ObjectId;
const path = require('path');
const fs = require('co-fs');
const url = require('url');
const uuid = require('uuid');
const debug = require('debug')('app:upload');
const config = require('../config.json');

/* ================================
 =       upload File
 @api  post  /upload/temp
 ================================ */
const uploadFilesToTemp = function* () {
    const ctx = this;
    const file = ctx.request.body.files.file;
    try {
        const distName = path.basename(file.path) + path.extname(file.name);
        const distPath = path.join(config.upload.root, config.upload.tempPath, distName);
        yield fs.rename(file.path, distPath);
        const pictureUrl = url.resolve(config.jwt.audience, config.upload.tempPath + '/' + distName);
        ctx.body = pictureUrl;
    } catch (e) {
        this.throw(412, e.message);
    }
};

/* ================================
 =       upload File
 @api  post  /upload
 ================================ */
const uploadFiles = function* () {
    const ctx = this;
    const body = ctx.request.body;
    const oldAvatar = body.fields.oldAvatar;
    const file = body.files.file;

    try {
        //  删除旧的头像
        const distName1 = path.basename(oldAvatar);
        const distPath1 = path.join(config.upload.root, config.upload.uploadPath, distName1);
        if (yield fs.exists(distPath1)) {
            yield fs.unlink(distPath1);
        }

        const distName = path.basename(file.path) + path.extname(file.name);
        const distPath = path.join(config.upload.root, config.upload.uploadPath, distName);
        yield fs.rename(file.path, distPath);
        const pictureUrl = url.resolve(config.jwt.audience, config.upload.uploadPath + '/' + distName);
        ctx.body = pictureUrl;
    } catch (e) {
        this.throw(412, e.message);
    }
};

/* ================================
 =       upload File
 @api  post  /upload/fromBase64/temp
 ================================ */

const uploadFilesFromBase64ToTemp = function* () {
    const ctx = this;
    const fields = ctx.request.body;
    const b64string = decodeBase64Image(fields.dataUrl);
    const imageBuffer = b64string.data;
    const distName = 'upload_' + uuid.v4() + '.jpg';
    const distPath = path.join(config.upload.root, config.upload.tempPath, distName);

    try {
        yield fs.writeFile(distPath, imageBuffer);
        const pictureUrl = url.resolve(config.jwt.audience, config.upload.tempPath + '/' + distName);
        ctx.body = pictureUrl;
    } catch (e) {
        this.throw(412, e.message);
    }
};


/* ================================
 =       upload File
 @api  post  /upload/fromBase64
 ================================ */

const uploadFilesFromBase64 = function* () {
    try {
        const ctx = this;
        const fields = ctx.request.body;
        const oldAvatar = fields.oldAvatar;
        const b64string = decodeBase64Image(fields.dataUrl);
        const imageBuffer = b64string.data;

        //  删除旧的头像
        const distName1 = path.basename(oldAvatar);
        const distPath1 = path.join(config.upload.root, config.upload.uploadPath, distName1);

        if (yield fs.exists(distPath1)) {
            console.log('unlink oldAvartar...');
            yield fs.unlink(distPath1);
        }

        const distName = 'upload_' + uuid.v4() + '.jpg';
        const distPath = path.join(config.upload.root, config.upload.uploadPath, distName);
        yield fs.writeFile(distPath, imageBuffer);
        const pictureUrl = url.resolve(config.jwt.audience, config.upload.uploadPath + '/' + distName);
        ctx.body = pictureUrl;
    } catch (e) {
        ctx.throw(412, e.message);
    }
};


function decodeBase64Image(dataString) {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}


router.post('/', uploadFiles);
router.post('/temp', uploadFilesToTemp);
router.post('/fromBase64/temp', uploadFilesFromBase64ToTemp);
router.post('/fromBase64', uploadFilesFromBase64);
module.exports = router;
