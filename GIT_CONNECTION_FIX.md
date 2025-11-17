# Git 连接问题修复指南

## 🔍 问题诊断

错误信息：`Connection closed by 20.205.243.160 port 443`

这表明 SSH 连接到 GitHub 的 443 端口被关闭。可能的原因：

1. GitHub SSH 服务在 443 端口暂时不可用
2. 网络防火墙或代理问题
3. SSH 密钥配置问题

## 🔧 解决方案

### 方案 1：使用 HTTPS 方式（推荐，最简单）

将远程仓库 URL 从 SSH 改为 HTTPS：

```bash
# 查看当前配置
git remote -v

# 改为 HTTPS
git remote set-url origin https://github.com/programmermark/easy-blog.git

# 验证
git remote -v

# 测试连接
git fetch origin
```

**优点**：

- 不需要 SSH 密钥配置
- 连接更稳定
- 适合大多数场景

**缺点**：

- 需要输入 GitHub 用户名和密码（或使用 Personal Access Token）

### 方案 2：修复 SSH 配置

如果必须使用 SSH，可以尝试：

#### 2.1 检查 SSH 密钥是否添加到 GitHub

```bash
# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 复制输出，然后到 GitHub 设置中添加 SSH Key
# https://github.com/settings/keys
```

#### 2.2 更新 SSH 配置

编辑 `~/.ssh/config`：

```bash
Host github.com
  HostName github.com
  Port 22
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
  # 添加以下配置以提高连接稳定性
  ServerAliveInterval 60
  ServerAliveCountMax 3
```

#### 2.3 测试 SSH 连接

```bash
# 测试标准端口 22
ssh -T git@github.com

# 如果 22 端口不行，测试 443 端口
ssh -T -p 443 git@ssh.github.com
```

### 方案 3：使用代理（如果在受限网络环境）

如果网络环境受限，可以配置代理：

```bash
# 在 ~/.ssh/config 中添加代理配置
Host github.com
  HostName github.com
  Port 22
  User git
  IdentityFile ~/.ssh/id_ed25519
  ProxyCommand nc -X 5 -x proxy.example.com:1080 %h %p
```

## 🚀 快速修复

### 已执行的修复

已将远程仓库 URL 从 SSH 切换到 HTTPS：

```bash
git remote set-url origin https://github.com/programmermark/easy-blog.git
```

### 如果仍然遇到 SSL 错误

如果 HTTPS 也出现 `SSL_ERROR_SYSCALL` 错误，可能是：

1. **网络连接问题** - 检查网络连接
2. **代理配置问题** - 检查是否有代理设置
3. **防火墙限制** - 检查防火墙设置

#### 临时解决方案

**选项 A：重试操作**

```bash
# 有时只是临时网络问题，重试即可
git fetch origin
git pull origin main
```

**选项 B：配置 Git 使用系统代理**

```bash
# 如果使用代理，配置 Git
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy https://proxy.example.com:8080

# 如果不使用代理，确保没有配置
git config --global --unset http.proxy
git config --global --unset https.proxy
```

**选项 C：增加 Git 超时时间**

```bash
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
```

**选项 D：使用 SSH 但改用标准端口**
如果 HTTPS 不行，可以尝试修改 SSH 配置使用标准端口 22：

编辑 `~/.ssh/config`：

```
Host github.com
  HostName github.com
  Port 22
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
```

然后改回 SSH URL：

```bash
git remote set-url origin git@github.com:programmermark/easy-blog.git
```

## 📝 使用 Personal Access Token

如果使用 HTTPS，GitHub 现在要求使用 Personal Access Token 而不是密码：

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 选择权限：至少需要 `repo` 权限
4. 生成后复制 token
5. 使用 token 作为密码进行 Git 操作

或者配置 Git 凭据助手：

```bash
# macOS
git config --global credential.helper osxkeychain

# 之后第一次输入用户名和 token，系统会记住
```

## ✅ 已应用的优化配置

已自动配置以下 Git 设置以提高连接稳定性：

```bash
# 使用 HTTP/1.1（更稳定）
git config --global http.version HTTP/1.1

# 增加缓冲区大小
git config --global http.postBuffer 524288000

# 增加超时时间
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999

# 确保 SSL 验证开启
git config --global http.sslVerify true
```

## ✅ 验证修复

修复后，运行以下命令验证：

```bash
# 测试连接
git fetch origin

# 查看远程分支
git branch -r

# 尝试 pull
git pull origin main
```

## 🔄 如果仍然失败

### 临时解决方案：稍后重试

网络连接问题通常是临时的，可以：

1. 等待几分钟后重试
2. 检查网络连接是否正常
3. 尝试访问 https://github.com 看是否能打开

### 使用镜像源（如果在中国大陆）

如果网络环境受限，可以考虑使用 GitHub 镜像：

```bash
# 使用 GitHub 镜像（示例）
git remote set-url origin https://ghproxy.com/https://github.com/programmermark/easy-blog.git
```

### 检查当前 Git 配置

```bash
# 查看所有 Git 配置
git config --global --list | grep http

# 查看远程 URL
git remote -v
```

---

**最后更新**：2025-11-17
