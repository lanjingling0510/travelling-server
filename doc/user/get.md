## 用户

用于获取单个用户

## 接口：

GET /user/123456


## 响应：

### 成功：200

响应格式：JSON

    {
	    "__v": 0,
	    "_id": "55fa83ad913461d01526fa65",
	    "createdAt": "2015-09-17T09:11:09.184Z",
	    "experience": 0,
	    "nickname": "陈大天",
	    "passhash": "$2a$08$HLaEzLXjoMNpy1jnnC/EO.BDrhAHDaoN2aDZfWPsN9UoRMyBVYypW",
	    "phone": "18875017305",
	    "rank": 0,
	    "type": "user",
	    "updatedAt": "2015-09-17T09:11:09.183Z",
	    "username": "chenyutian0510"
    }

缓存配置：使用`ETag`进行缓存。

### 参数不合法：412

参考标准412响应