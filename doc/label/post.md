## 新建标签

用于添加旅游标签分类

## 接口：

POST /label

## 提交的payload：


    名称		类型		定义				必需		
    content	 string	   标签内容			 "风景"	


## 响应：

### 成功：200

响应格式：string

    '添加标签成功'

缓存配置：使用`ETag`进行缓存。

### 参数不合法：412

参考标准412响应