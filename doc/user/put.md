## 修改用户

用于修改单个用户

## 接口：

PUT /user/123456

## 请求payload：

	名称
    password	
	rank			
    experience		
    nickname				
    phone					
## 响应：

### 成功：200

响应格式：JSON

     修改成功

缓存配置：使用`ETag`进行缓存。

### 参数不合法：412

参考标准412响应