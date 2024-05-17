# Introduction

This example documentation contains all the possible configuration options for apidoc.

## 统一规则

1. 成功返回

```json
{
    "success": true, //成功
    "data": {}, //数据
    "count": 100 //记录总数
}
```

2. 失败返回

```json
{
    "success": false, //失败
    "message": "" //错误信息
}
```

3. 分页

```json
{
    "pageIndex": 1, //分页序号 从1开始
    "pageSize": 10 //分页数量
}
```
