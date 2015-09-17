'use strict';

const mongoose = require('../common/db').mongoose;
const validateField = require('../common/validate');

const UserSchema = mongoose.Schema({
    username: {type: String, unique: true, trim: true},
    passhash: String,
    nickname: {type: String, default: '匿名用户' + Date.now()},
    phone: String,
    rank: {type: Number, default: 0},
    experience: {type: Number, default: 0},
    type: {type: String, default: 'user'},
    createdAt: {type: Date, default: Date.now},
    updatedAt: Date
}, {collection: 'Users'});


UserSchema.pre('save', function (next) {
    const schema = this;


    const regexpList = {
        username: [
            {
                type: 'required',
                msg: '用户名不能为空'
            },
            {
                type: 'match',
                value: /\w{6,20}/,
                msg: '用户名在6-20字符之间'
            }
        ],
        passhash: [
            {
                type: 'required',
                msg: '密码不能为空'
            }
        ]
        //phone: [
        //    {
        //        type: 'match',
        //        value: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
        //        msg: '电话格式不正确'
        //    }
        //]
    };
    next(validateField(schema, regexpList));
});





const User = mongoose.model('User', UserSchema);

module.exports = User;
