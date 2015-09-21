## 分享列表

用于根据标签分类获取分享列表

## 接口：

GET /label/123456/share/123456

## 请求参数：


    名称		类型		定义				必需		
	search 	string	查询的字段
    keyword	string	查询关键词				
    page	number	页码				    1			
    orderBy	string	排序字段名称		    “experience”			
    order	string	排序方式			  “desc”			
	limit	string  每页条数			  10

## 响应：

### 成功：200

响应格式：JSON

	[{
	    "text": "法拉盛叫东方拉斯地方见撒旦离开房间爱死了快递费",
	    "city": "重庆",
	    "place": "重庆市",
	    "userId": "55fa83ad913461d01526fa65",
	    "_id": "55fbddd991479e2022ae3285",
	    "replyCount": 0,
	    "date": "2015-09-18T09:48:09.133Z",
	    "score": 0,
	    "labels": ["55fb83172665c7c00a6ed852"],
	    "location": [50, 100],
	    "imgs": [],
	    "__v": 0
	}]

缓存配置：使用`ETag`进行缓存。

### 参数不合法：412

参考标准412响应