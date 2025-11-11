"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Space,
  Typography,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  UserAddOutlined,
  BookOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { LoginDto } from "@/types";
import Link from "next/link";
import { ADMIN_BASE_PATH } from "@/config/basePath";

const { Text, Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, error, clearError } = useAuth();

  const onFinish = async (values: LoginDto) => {
    setLoading(true);
    clearError();

    try {
      await login(values);
      message.success("登录成功");
      router.push(ADMIN_BASE_PATH);
    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* 背景渐变和装饰 */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to bottom right, #eff6ff, #e0e7ff, #faf5ff)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* 装饰性几何图形 */}
      <div
        className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"
        style={{
          position: "absolute",
          top: "80px",
          left: "80px",
          width: "128px",
          height: "128px",
          backgroundColor: "#dbeafe",
          borderRadius: "50%",
          opacity: 0.2,
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      />
      <div
        className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-pulse"
        style={{
          position: "absolute",
          top: "160px",
          right: "128px",
          width: "96px",
          height: "96px",
          backgroundColor: "#e9d5ff",
          borderRadius: "50%",
          opacity: 0.3,
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          animationDelay: "1s",
        }}
      />
      <div
        className="absolute bottom-32 left-40 w-20 h-20 bg-indigo-200 rounded-full opacity-25 animate-pulse"
        style={{
          position: "absolute",
          bottom: "128px",
          left: "160px",
          width: "80px",
          height: "80px",
          backgroundColor: "#c7d2fe",
          borderRadius: "50%",
          opacity: 0.25,
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute bottom-20 right-20 w-28 h-28 bg-pink-200 rounded-full opacity-20 animate-pulse"
        style={{
          position: "absolute",
          bottom: "80px",
          right: "80px",
          width: "112px",
          height: "112px",
          backgroundColor: "#fce7f3",
          borderRadius: "50%",
          opacity: 0.2,
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          animationDelay: "0.5s",
        }}
      />

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo和标题区域 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <BookOutlined className="text-2xl text-white" />
            </div>
            <Title level={2} className="!text-gray-800 !mb-2">
              博客管理后台
            </Title>
            <Text className="text-gray-600 text-lg">
              欢迎回来，请登录您的账户
            </Text>
          </div>

          {/* 登录卡片 */}
          <Card
            className="shadow-2xl border-0 rounded-2xl overflow-hidden"
            styles={{ body: { padding: "40px" } }}
          >
            <Form
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">邮箱地址</span>
                }
                name="email"
                rules={[
                  { required: true, message: "请输入邮箱" },
                  { type: "email", message: "请输入有效的邮箱地址" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="请输入邮箱地址"
                  className="h-12 rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-medium">密码</span>}
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="请输入密码"
                  className="h-12 rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <SafetyOutlined className="text-red-500 mr-2" />
                    <Text className="text-red-600 text-sm">{error}</Text>
                  </div>
                </div>
              )}

              <Form.Item className="mb-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-base"
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "8px",
                    background: "linear-gradient(to right, #3b82f6, #9333ea)",
                    border: "none",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    fontWeight: "500",
                    fontSize: "16px",
                  }}
                >
                  {loading ? "登录中..." : "立即登录"}
                </Button>
              </Form.Item>

              <Divider className="my-6">
                <Text className="text-gray-400">或</Text>
              </Divider>

              <div className="text-center">
                <Space>
                  <Text className="text-gray-600">还没有账户？</Text>
                  <Link
                    href="/register"
                    className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center"
                  >
                    <UserAddOutlined className="mr-1" />
                    立即注册
                  </Link>
                </Space>
              </div>
            </Form>
          </Card>

          {/* 底部信息 */}
          <div className="text-center mt-8">
            <Text className="text-gray-500 text-sm">
              安全登录 · 数据保护 · 隐私优先
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
