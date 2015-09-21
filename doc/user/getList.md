## 用户列表

用于获取用户列表，带分页功能

## 接口：

GET /user

## 请求参数：


    名称		类型		定义				必需		
	search	string  查询的字段名		
    keyword	string	查询关键词				
    page	number	页码				    1			
    orderBy	string	排序字段名称		    “experience”			
    order	string	排序方式			  “desc”			
	limit	string  每页条数			  10

## 响应：

### 成功：200

响应格式：JSON

    [{
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
    }]

缓存配置：使用`ETag`进行缓存。

### 参数不合法：412

参考标准412响应