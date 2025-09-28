# 分类和标签 API 文档

## 概述

博客管理后台现在支持分类和标签的完整管理功能，包括创建、查询、更新和删除操作。

## 分类 API

### 基础路径

`/categories`

### 接口列表

#### 1. 创建分类

- **方法**: `POST`
- **路径**: `/categories`
- **认证**: 需要登录
- **请求体**:
  ```json
  {
    "name": "技术分享",
    "slug": "tech" // 可选，不提供会自动生成
  }
  ```
- **响应**:
  ```json
  {
    "id": "category123",
    "name": "技术分享",
    "slug": "tech"
  }
  ```

#### 2. 获取所有分类

- **方法**: `GET`
- **路径**: `/categories`
- **认证**: 无需登录
- **响应**:
  ```json
  [
    {
      "id": "category123",
      "name": "技术分享",
      "slug": "tech",
      "_count": {
        "posts": 5
      }
    }
  ]
  ```

#### 3. 根据 ID 获取分类

- **方法**: `GET`
- **路径**: `/categories/:id`
- **认证**: 无需登录
- **响应**: 同创建分类响应，包含文章数量

#### 4. 根据别名获取分类

- **方法**: `GET`
- **路径**: `/categories/slug/:slug`
- **认证**: 无需登录
- **响应**: 同创建分类响应，包含文章数量

#### 5. 更新分类

- **方法**: `PATCH`
- **路径**: `/categories/:id`
- **认证**: 需要登录
- **请求体**:
  ```json
  {
    "name": "技术文章", // 可选
    "slug": "tech-articles" // 可选
  }
  ```
- **响应**: 同创建分类响应，包含文章数量

#### 6. 删除分类

- **方法**: `DELETE`
- **路径**: `/categories/:id`
- **认证**: 需要登录
- **响应**:
  ```json
  {
    "message": "分类删除成功"
  }
  ```

## 标签 API

### 基础路径

`/tags`

### 接口列表

#### 1. 创建标签

- **方法**: `POST`
- **路径**: `/tags`
- **认证**: 需要登录
- **请求体**:
  ```json
  {
    "name": "JavaScript",
    "slug": "javascript" // 可选，不提供会自动生成
  }
  ```
- **响应**:
  ```json
  {
    "id": "tag123",
    "name": "JavaScript",
    "slug": "javascript"
  }
  ```

#### 2. 获取所有标签

- **方法**: `GET`
- **路径**: `/tags`
- **认证**: 无需登录
- **响应**:
  ```json
  [
    {
      "id": "tag123",
      "name": "JavaScript",
      "slug": "javascript",
      "_count": {
        "posts": 3
      }
    }
  ]
  ```

#### 3. 根据 ID 获取标签

- **方法**: `GET`
- **路径**: `/tags/:id`
- **认证**: 无需登录
- **响应**: 同创建标签响应，包含文章数量

#### 4. 根据别名获取标签

- **方法**: `GET`
- **路径**: `/tags/slug/:slug`
- **认证**: 无需登录
- **响应**: 同创建标签响应，包含文章数量

#### 5. 更新标签

- **方法**: `PATCH`
- **路径**: `/tags/:id`
- **认证**: 需要登录
- **请求体**:
  ```json
  {
    "name": "React", // 可选
    "slug": "react" // 可选
  }
  ```
- **响应**: 同创建标签响应，包含文章数量

#### 6. 删除标签

- **方法**: `DELETE`
- **路径**: `/tags/:id`
- **认证**: 需要登录
- **响应**:
  ```json
  {
    "message": "标签删除成功"
  }
  ```

## 特性说明

### 1. 自动生成 Slug

- 如果不提供 `slug` 参数，系统会根据 `name` 自动生成
- 生成规则：转换为小写，移除特殊字符，空格替换为连字符
- 例如："前端开发" → "前端开发"

### 2. 唯一性验证

- 分类和标签的 `name` 和 `slug` 都必须唯一
- 创建或更新时会检查重复性

### 3. 关联文章统计

- 查询接口会返回该分类/标签下的文章数量
- 通过 `_count.posts` 字段提供

### 4. 删除保护

- 如果分类或标签下还有文章，无法删除
- 会返回 409 错误："无法删除，该分类/标签下还有文章"

### 5. 认证要求

- 创建、更新、删除操作需要登录认证
- 查询操作无需认证
- 使用 cookie 认证方式

## 错误响应

### 401 Unauthorized

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 404 Not Found

```json
{
  "message": "分类不存在",
  "statusCode": 404
}
```

### 409 Conflict

```json
{
  "message": "分类名称已存在",
  "statusCode": 409
}
```

## 前端使用示例

### 获取分类列表

```javascript
const getCategories = async () => {
  const response = await fetch('/api/categories', {
    credentials: 'include',
  });
  return response.json();
};
```

### 创建分类

```javascript
const createCategory = async (name, slug) => {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, slug }),
  });
  return response.json();
};
```

### 更新分类

```javascript
const updateCategory = async (id, data) => {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return response.json();
};
```

### 删除分类

```javascript
const deleteCategory = async (id) => {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return response.json();
};
```

标签 API 的使用方式完全相同，只需要将路径从 `/categories` 改为 `/tags` 即可。
