'use strict';
const expect = require('chai').expect;
const app = require('../../index');
const request = require('supertest').agent(app.listen());
const co = require('co');
const data = require('../data/users.json');
const User = require('../../models').User;

const user0 = data.user0;
const user1 = data.user1;
const user2 = data.user2;
const user3 = data.user3;

let token0 = null;
let _id0 = null;

describe('User test ...', function () {
    this.timeout(20000); // should take less than 20000m

    before(function (done) {
        co(function *() {
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


    after(function (done) {
      co(function *() {
        yield User.findByIdAndRemove(_id0);
        done();
      }).catch(function (err) {
        done(err);
      });
    })


    describe('#find', function() {
      it('should return do not Authorization', function (done) {
        request
        .get('/user/' + _id0)
        .expect(401)
        .end(done);
      })
    })


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
