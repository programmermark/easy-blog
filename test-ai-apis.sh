#!/bin/bash

# AI 写作助手 API 测试脚本
# 使用方法: ./test-ai-apis.sh <token> [base_url]

set -e

TOKEN=${1:-""}
BASE_URL=${2:-"http://localhost:8000/blog-service"}

if [ -z "$TOKEN" ]; then
  echo "❌ 错误: 请提供 JWT Token"
  echo "使用方法: ./test-ai-apis.sh <token> [base_url]"
  exit 1
fi

echo "🚀 开始测试 AI 写作助手 API"
echo "Base URL: $BASE_URL"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试函数
test_api() {
  local name=$1
  local endpoint=$2
  local data=$3
  
  echo -n "测试 $name... "
  
  response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}${endpoint}" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN}" \
    -d "$data")
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ 成功${NC}"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
  else
    echo -e "${RED}✗ 失败 (HTTP $http_code)${NC}"
    echo "$body"
  fi
  echo ""
}

# 1. 生成标题
test_api "生成标题" "/ai/writing/generate-title" '{
  "content": "这是一篇关于NestJS框架的技术文章，介绍了其特点、优势和使用场景。NestJS是一个用于构建高效、可扩展的Node.js服务器端应用程序的框架。"
}'

# 2. 生成摘要
test_api "生成摘要" "/ai/writing/generate-summary" '{
  "content": "NestJS是一个强大的Node.js框架，它使用TypeScript构建，提供了完整的解决方案来构建可扩展的服务器端应用程序。它采用了模块化的架构，使得代码组织更加清晰。NestJS提供了依赖注入、装饰器等现代开发特性，让开发者能够更高效地构建应用程序。",
  "maxLength": 200
}'

# 3. 生成内容
test_api "生成内容" "/ai/writing/generate-content" '{
  "prompt": "写一篇关于TypeScript的技术文章，介绍其基本特性和优势",
  "context": "目标读者是中级开发者"
}'

# 4. 优化内容
test_api "优化内容" "/ai/writing/optimize" '{
  "content": "这是一段需要优化的文本，可能有一些语法错误或表达不够清晰的地方。",
  "instruction": "使语言更专业"
}'

# 5. 续写
test_api "续写" "/ai/writing/continue" '{
  "content": "NestJS是一个强大的Node.js框架，它使用TypeScript构建。"
}'

# 6. 文章分析
test_api "文章分析" "/ai/writing/analyze" '{
  "content": "NestJS是一个用于构建高效、可扩展的Node.js服务器端应用程序的框架。它使用TypeScript构建，提供了完整的解决方案。",
  "title": "NestJS框架介绍"
}'

echo -e "${GREEN}✅ 所有测试完成${NC}"

