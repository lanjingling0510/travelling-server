'use strict';

/**
 *  package dependencies
 */


const router = require('koa-router')();
const passport = require('../common/passport');
const Model = require('../models');
const User = Model.User;
const hashword = require('hashword');
const debug = require('debug')('app:user');
const ObjectId = require('mongoose').Types.ObjectId;


/* ================================
 =       create User
 @api  post  /user
 ================================ */

const createUser = function* () {
  const ctx = this;
  const password = ctx.request.body.password;
  try {
    if (!(/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/.test(password))) {
      throw new Error('密码长度为6-22!');
    }

    const user = {
      username: ctx.request.body.username,
      passhash: hashword.hashPassword(password),
      updatedAt: new Date()
    };

    yield User.createUser(user);
    ctx.body = '注册成功';
    ctx.status = 200;
  } catch (e) {
    ctx.body = e.message;
    ctx.status = 412;
  }
};


/* ================================
 =       find Users
 @api  get  /user
 ================================ */

const findUsers = function* () {
  const ctx = this;
  const query = Object.assign({
    page: 0,
    limit: 10,
    orderBy: 'experience',
    order: -1
  }, ctx.query);
  const match = {};

  // 根据关注或粉丝
  if (query.search && ['fans', 'followings'].indexOf(query.search) !== -1) {
    match[query.search] = {
      $in: [new ObjectId(query.keyword)]
    };
  }

  //  根据昵称
  if (query.search && query.search === 'nickname') {
    if (!query.keyword) {
      ctx.body = [];
      return;
    }
    match[query.search] = {
      $regex: query.keyword
    };
  }

  try {
    const result = yield User.aggregate()
      .match(match)
      .project('_id avatar nickname')
      .sort({
        [query.orderBy]: query.order
      })
      .skip(query.page * query.limit)
      .limit(Number(query.limit))
      .exec();
    ctx.body = result;
  } catch (e) {
    ctx.throw(412, e.message);
  }
};


/* ================================
 =       find User
 @api  get  /user/123456
 ================================ */

const findUser = function* () {
  const ctx = this;
  const _id = ctx.params._id;
  try {
    const list = yield User.aggregate()
      .match({
        _id: new ObjectId(_id)
      })
      .project({
        nickname: 1,
        avatar: 1,
        collectionsNumber: {
          $size: '$collections'
        },
        sharesNumber: {
          $size: '$shares'
        },
        fansNumber: {
          $size: '$fans'
        },
        followingsNumber: {
          $size: '$followings'
        }
      })
      .exec();

    ctx.body = list[0];
    ctx.status = 200;
  } catch (e) {
    this.throw(e.message, 412);
    debug(e.message);
  }
};

/* ================================
 =       find SharesByMe
 @api  get  /user/123456/share
 ================================ */

const findSharesByMe = function* () {
  const ctx = this;
  const _id = ctx.params._id;
  const query = ctx.query;
  const project = {
    shares: {
      $slice: [query.limit * query.page, query.limit * query.page + query.limit * 1]
    }
  };

  try {
    const user = yield User.findOne({
      _id: new ObjectId(_id)
    }, project)
      .populate('shares');
    ctx.body = user.shares;
  } catch (e) {
    this.throw(e.message, 412);
  }
};

/* ================================
 =       find SharesByMe
 @api  get  /user/123456/share/collect
 ================================ */

const findSharesBycollections = function* () {
  const ctx = this;
  const _id = ctx.params._id;
  const query = ctx.query;
  const project = {
    collections: {
      $slice: [query.limit * query.page, query.limit * query.page + query.limit * 1]
    }
  };

  try {
    const user = yield User.findOne({
      _id: new ObjectId(_id)
    }, project)
      .populate('collections');
    ctx.body = user.collections;
  } catch (e) {
    this.throw(e.message, 412);
  }
};

/* ================================
 =       update User
 @api  put  /user/123456
 ================================ */

const updateUser = function* () {
  const ctx = this;
  const field = ctx.request.body;
  const _id = ctx.params._id;
  const password = field.password;

  try {
    if (password && !(/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/.test(password))) {
      throw new Error('密码长度为6-22!');
    }

    password && (field.passhash = hashword.hashPassword(password));
    yield User.updateUser({
      _id: _id
    }, field);
    ctx.body = '修改成功';
    ctx.status = 200;
  } catch (e) {
    ctx.throw(412, e.message);
    debug(e.message);
  }
};

/* ================================
 =       follow User
 @api  put  /user/123456/follow
 ================================ */

const followUser = function* () {
  const ctx = this;
  const field = ctx.request.body;
  const _id = ctx.params._id;

  try {
    const promises = [
      User.findByIdAndUpdate(_id, {
        $push: {
          fans: {
            $each: [field.userId],
            $position: 0
          }
        }
      }),
      User.findByIdAndUpdate(field.userId, {
        $push: {
          followings: {
            $each: [_id],
            $position: 0
          }
        }
      })
    ];
    yield promises;

    ctx.body = 'follow';
    ctx.status = 200;
  } catch (e) {
    ctx.throw(e.message, 412);
  }
};

/* ================================
 =       unfollow User
 @api  put  /user/123456/unfollow
 ================================ */

const unfollowUser = function* () {
  const ctx = this;
  const field = ctx.request.body;
  const _id = ctx.params._id;

  try {
    const promises = [
      User.findByIdAndUpdate(_id, {
        $pull: {
          fans: field.userId
        }
      }),
      User.findByIdAndUpdate(field.userId, {
        $pull: {
          followings: _id
        }
      })
    ];
    yield promises;

    ctx.body = 'unfollow';
    ctx.status = 200;
  } catch (e) {
    ctx.throw(e.message, 412);
  }
};

/* ================================
 =       judgefollow User
 @api  put  /user/123456/judgefollow
 ================================ */

const judgefollowUser = function* () {
  const ctx = this;
  const userId = ctx.query.userId;
  const _id = ctx.params._id;
  try {
    const user = yield User.find({
      _id: _id,
      fans: {
        $in: [userId]
      }
    });
    if (user.length === 0) ctx.body = 'unfollow';
    else ctx.body = 'follow';
  } catch (e) {
    ctx.throw(e.message, 412);
  }
};

router.post('/', createUser);

router.use(passport.authenticate('jwt', { session: false }));

router.get('/', findUsers);
router.get('/:_id', findUser);
router.get('/:_id/judgefollow', judgefollowUser);

router.get('/:_id/share', findSharesByMe);
router.get('/:_id/share/collect', findSharesBycollections);

router.put('/:_id', updateUser);
router.put('/:_id/follow', followUser);
router.put('/:_id/unfollow', unfollowUser);

module.exports = router;
