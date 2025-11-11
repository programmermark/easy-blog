# Cookie 认证使用示例

## 概述

服务端现在使用 HTTP-only cookie 来存储和传输 JWT token，而不是在响应体中返回 token。这提供了更好的安全性，因为 JavaScript 无法访问 HTTP-only cookie。

> 提示：部署到服务器时，以下示例中的 `/api/*` 需要替换为 `/blog-service/*`。

## 前端使用方式

### 1. 登录

```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 重要：允许发送和接收 cookies
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // 用户信息在 data.user 中
      // token 会自动存储在 cookie 中
      return data.user;
    } else {
      throw new Error('登录失败');
    }
  } catch (error) {
    console.error('登录错误:', error);
    throw error;
  }
};
```

### 2. 检查认证状态

```javascript
const checkAuthStatus = async () => {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include', // 重要：允许发送 cookies
    });

    if (response.ok) {
      const user = await response.json();
      set({ user, isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  } catch {
    set({ user: null, isAuthenticated: false });
  }
};
```

### 3. 登出

```javascript
const logout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // 重要：允许发送 cookies
    });

    set({ user: null, isAuthenticated: false });
  } catch (error) {
    console.error('登出错误:', error);
  }
};
```

### 4. 注册

```javascript
const register = async (email, password, name) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 重要：允许发送和接收 cookies
      body: JSON.stringify({ email, password, name }),
    });

    if (response.ok) {
      const data = await response.json();
      // 用户信息在 data.user 中
      // token 会自动存储在 cookie 中
      return data.user;
    } else {
      const error = await response.json();
      throw new Error(error.message || '注册失败');
    }
  } catch (error) {
    console.error('注册错误:', error);
    throw error;
  }
};
```

## 重要配置

### 1. CORS 配置

确保前端请求包含 `credentials: 'include'`，这样浏览器才会发送 cookies。

### 2. Cookie 安全设置

服务端设置的 cookie 具有以下安全特性：

- `HttpOnly`: 防止 JavaScript 访问
- `SameSite=Lax`: 防止 CSRF 攻击
- `Secure`: 在生产环境中只通过 HTTPS 传输
- `Max-Age=900`: 15 分钟过期时间

### 3. 向后兼容

JWT 策略同时支持从 cookie 和 Authorization header 中提取 token，确保向后兼容性。

## API 接口变化

### 登录/注册响应

**之前:**

```json
{
  "access_token": "jwt_token_here",
  "user": { ... }
}
```

**现在:**

```json
{
  "user": { ... }
}
```

Token 现在通过 `Set-Cookie` 头设置，不再在响应体中返回。

### 认证方式

**之前:** 需要在请求头中设置 `Authorization: Bearer <token>`

**现在:** 自动通过 cookie 发送，无需手动处理 token

## 优势

1. **安全性更高**: HTTP-only cookie 无法被 JavaScript 访问，防止 XSS 攻击
2. **使用更简单**: 前端无需手动管理 token
3. **自动过期**: Cookie 会自动过期，无需手动处理
4. **防止 CSRF**: 通过 SameSite 属性防止跨站请求伪造
