## 注册用户

用于新建用户

## 接口：

POST /user

## 请求参数：


    名称			类型		定义				必需		
    username	 string	   查询关键词		"chenyutian0510"				
    password	 string	   排序字段名称	   "123456"  			

## 响应：

### 成功：200

响应格式：JSON

    '注册成功'

缓存配置：使用`ETag`进行缓存。

### 参数不合法：412

参考标准412响应