# 部署脚本 Git 连接问题修复

## 🔍 问题描述

在 GitHub Actions 部署过程中，服务器执行 `git pull origin main` 时失败：

```
error: RPC failed; curl 7 Failed to connect to github.com port 443: Connection timed out
fatal: the remote end hung up unexpectedly
```

## ✅ 已应用的修复

### 1. 配置 Git 连接优化

在部署脚本中添加了以下 Git 配置：

```bash
# 配置 Git pull 策略（避免警告）
git config pull.rebase false

# 使用 HTTP/1.1（更稳定）
git config http.version HTTP/1.1

# 增加缓冲区大小
git config http.postBuffer 524288000

# 增加超时时间
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999
```

### 2. 添加重试机制

实现了自动重试机制，最多重试 3 次：

```bash
MAX_RETRIES=3
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if git pull origin main; then
    echo "✅ Git pull 成功"
    break
  else
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "⚠️ Git pull 失败，${RETRY_COUNT}/${MAX_RETRIES} 次重试，等待 10 秒后重试..."
      sleep 10
    else
      echo "❌ Git pull 失败，已达到最大重试次数"
      exit 1
    fi
  fi
done
```

## 🔧 如果问题仍然存在

### 方案 1：使用 GitHub 镜像（推荐，如果服务器在中国大陆）

如果服务器在中国大陆，可以使用 GitHub 镜像：

```bash
# 在部署脚本中，将 git pull 改为：
git remote set-url origin https://ghproxy.com/https://github.com/programmermark/easy-blog.git || true
git pull origin main
```

或者使用其他镜像：
- `https://ghproxy.com/https://github.com/...`
- `https://mirror.ghproxy.com/https://github.com/...`

### 方案 2：配置代理

如果服务器有代理，可以在部署脚本中配置：

```bash
# 设置代理（替换为实际代理地址）
export http_proxy=http://proxy.example.com:8080
export https_proxy=http://proxy.example.com:8080

git pull origin main
```

### 方案 3：使用 SSH 替代 HTTPS

如果 SSH 连接更稳定，可以改用 SSH：

```bash
# 在服务器上配置 SSH
git remote set-url origin git@github.com:programmermark/easy-blog.git

# 确保 SSH 密钥已配置
git pull origin main
```

### 方案 4：在服务器上手动配置 Git

在服务器上永久配置 Git：

```bash
# SSH 登录到服务器
ssh user@your-server

# 进入项目目录
cd /opt/easy-blog

# 配置 Git
git config pull.rebase false
git config http.version HTTP/1.1
git config http.postBuffer 524288000
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999

# 如果使用代理
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy http://proxy.example.com:8080
```

## 📝 修改的文件

- `.github/workflows/deploy.yml`: 更新了部署脚本，添加了 Git 配置和重试机制

## ✅ 验证

修复后，下次推送代码到 main 分支时，GitHub Actions 会自动执行部署，Git pull 应该能够成功。

如果仍然失败，请检查：
1. 服务器网络连接是否正常
2. 是否可以访问 GitHub（`curl -I https://github.com`）
3. 是否需要配置代理或使用镜像

---

**最后更新**: 2025-11-18

