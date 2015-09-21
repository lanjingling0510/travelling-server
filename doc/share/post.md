## 添加分享

用于上传用户的分享

## 接口：

GET /user

## 请求payload：


    名称			类型					定义				必需		
	text		string  			分享的描述		   "这个地方不错"
    coordinates	[number,number]		坐标位置			[10, 100]
    labels		[string, string]	分类id			  [ffdfafda, fsafadsf]	    			
    city		string				所在城市		    "重庆"			
    place		string				详细位置			“重庆市108国道”			
	userId		string  			上传作者id		    fadfsdsd

## 响应：

### 成功：200

响应格式：string

    '分享成功'

缓存配置：使用`ETag`进行缓存。

### 参数不合法：412

参考标准412响应