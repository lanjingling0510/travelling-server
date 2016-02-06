'use strict';

const mongoose = require('../common/db').mongoose;
const Schema = mongoose.Schema;

const ShareSchema = Schema({
  text: String, // 分享文字
  images: { // 分享照片
    type: [String],
    default: []
  },
  coordinates: {  // 分享坐标
    type: [Number],
    index: '2d'
  },
  labels: { // 分享的分类标签
    type: [String],
    default: []
  },
  city: String, // 分享的城市
  place: String, // 分享的地方
  score: {  // 分享的分数
    type: Number,
    default: 0
  },
  createAt: { // 创建时间
    type: Date,
    default: Date.now
  },
  userId: { // 用户Id
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  replys: [{ // 回复用户的ID数组
    type: Schema.Types.ObjectId,
    ref: 'Reply'
  }],
  favorited: [{ // 收藏的用户的ID数组
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  collection: 'Shares',
  versionKey: false
});


const Share = mongoose.model('Share', ShareSchema);

module.exports = Share;
