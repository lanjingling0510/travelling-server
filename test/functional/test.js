'use strict';
const expect = require('chai').expect;
const app = require('../../index');
const request = require('supertest').agent(app.listen());
const co = require('co');
const data = require('../data/data.json');
const User = require('../../models').User;

const user0 = data.user0;
const user1 = data.user1;
const user2 = data.user2;
const user3 = data.user3;

let token0 = null;
let _id0 = null;

beforeEach(function() {
    console.log('before every test in every file');
});

describe('User', function () {
    this.timeout(20000);
    before(function (done) {
        co(function *() {
            yield User.remove();
            request
                .post('/user')
                .send(user0)
                .end(function (err, res) {
                    request
                        .post('/auth/token')
                        .send(user0)
                        .end(function (err, res) {
                            token0 = res.body.access_token;
                            request
                                .get('/auth/profile')
                                .set('Authorization', 'Bearer ' + token0)
                                .end(function (err, res) {
                                    _id0 = res.body._id;
                                    done();
                                });
                        });
                });

        }).catch(function (err) {
            done(err);
        });
    });


    describe('#create', function () {
        it('should return 412 用户名在6-20字符之间', function (done) {
            request
                .post('/user')
                .send(user1)
                .expect(412)
                .end(done);
        });
    });

    describe('#update', function () {
        it('should return 412 密码长度为6-22!', function (done) {
            request
                .put('/user/' + _id0)
                .set('Authorization', 'Bearer ' + token0)
                .send(user2)
                .expect(412)
                .end(done);
        });

        it('should return 200 修改成功', function (done) {
            request
                .put('/user/' + _id0)
                .set('Authorization', 'Bearer ' + token0)
                .send(user3)
                .expect(200)
                .end(done);
        });

    });
});
