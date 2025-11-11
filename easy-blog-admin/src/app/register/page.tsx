"use client";

import { useState, useEffect, useRef } from "react";
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
  Progress,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  LoginOutlined,
  BookOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { RegisterDto } from "@/types";
import Link from "next/link";
import requestClient from "@/lib/request-client";
import { ADMIN_APP_RELATIVE_BASE_PATH } from "@/config/basePath";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [form] = Form.useForm();
  const router = useRouter();
  const { login, error, clearError } = useAuth();

  const onFinish = async (
    values: RegisterDto & { confirmPassword?: string }
  ) => {
    setLoading(true);
    clearError();

    try {
      // 移除 confirmPassword 字段，只传递必要的注册信息
      const { confirmPassword, ...registerData } = values;

      const response = await requestClient.post("/auth/register", registerData);
      const data = response.data;

      // 注册成功后自动登录
      await login({ email: values.email, password: values.password });
      message.success("注册成功，已自动登录");
      router.push(ADMIN_APP_RELATIVE_BASE_PATH);
    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : "注册失败");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    let strength = 0;

    // 只有当密码不为空时才计算强度
    if (password.length > 0) {
      if (password.length >= 6) strength += 25;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
    }

    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "#ff4d4f";
    if (passwordStrength < 50) return "#faad14";
    if (passwordStrength < 75) return "#52c41a";
    return "#1890ff";
  };

  // 监听密码字段变化
  const [passwordValue, setPasswordValue] = useState("");

  useEffect(() => {
    if (passwordValue) {
      handlePasswordChange({
        target: { value: passwordValue },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [passwordValue]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景渐变和装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* 装饰性几何图形 */}
      <div className="absolute top-16 left-16 w-36 h-36 bg-purple-200 rounded-full opacity-20 animate-pulse" />
      <div
        className="absolute top-32 right-24 w-28 h-28 bg-pink-200 rounded-full opacity-30 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-28 left-32 w-24 h-24 bg-blue-200 rounded-full opacity-25 animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-16 right-16 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo和标题区域 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
              <BookOutlined className="text-2xl text-white" />
            </div>
            <Title level={2} className="!text-gray-800 !mb-2">
              创建新账户
            </Title>
            <Text className="text-gray-600 text-lg">
              加入我们，开始您的博客管理之旅
            </Text>
          </div>

          {/* 注册卡片 */}
          <Card
            className="shadow-2xl border-0 rounded-2xl overflow-hidden"
            styles={{ body: { padding: "40px" } }}
          >
            <Form
              name="register"
              form={form}
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <Form.Item
                label={<span className="text-gray-700 font-medium">姓名</span>}
                name="name"
                rules={[
                  { required: true, message: "请输入姓名" },
                  { min: 2, message: "姓名至少2个字符" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="请输入您的姓名"
                  className="h-12 rounded-lg border-gray-200 hover:border-purple-400 focus:border-purple-500"
                />
              </Form.Item>

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
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="请输入邮箱地址"
                  className="h-12 rounded-lg border-gray-200 hover:border-purple-400 focus:border-purple-500"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-medium">密码</span>}
                name="password"
                rules={[
                  { required: true, message: "请输入密码" },
                  { min: 6, message: "密码至少6个字符" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="请输入密码"
                  className="h-12 rounded-lg border-gray-200 hover:border-purple-400 focus:border-purple-500"
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
              </Form.Item>
              {passwordStrength > 0 && (
                <div className="mt-2">
                  <Progress
                    percent={passwordStrength}
                    strokeColor={getPasswordStrengthColor()}
                    showInfo={false}
                    size="small"
                  />
                  <Text className="text-xs text-gray-500 mt-1 block">
                    {passwordStrength < 25 && "密码强度：弱"}
                    {passwordStrength >= 25 &&
                      passwordStrength < 50 &&
                      "密码强度：一般"}
                    {passwordStrength >= 50 &&
                      passwordStrength < 75 &&
                      "密码强度：良好"}
                    {passwordStrength >= 75 && "密码强度：强"}
                  </Text>
                </div>
              )}

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">确认密码</span>
                }
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "请确认密码" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("两次输入的密码不一致"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="请再次输入密码"
                  className="h-12 rounded-lg border-gray-200 hover:border-purple-400 focus:border-purple-500"
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
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-base"
                >
                  {loading ? "注册中..." : "立即注册"}
                </Button>
              </Form.Item>

              <Divider className="my-6">
                <Text className="text-gray-400">或</Text>
              </Divider>

              <div className="text-center">
                <Space>
                  <Text className="text-gray-600">已有账户？</Text>
                  <Link
                    href={`/login`}
                    className="text-purple-500 hover:text-purple-600 font-medium transition-colors duration-200 flex items-center"
                  >
                    <LoginOutlined className="mr-1" />
                    立即登录
                  </Link>
                </Space>
              </div>
            </Form>
          </Card>

          {/* 底部信息 */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-6 text-gray-500 text-sm">
              <div className="flex items-center">
                <CheckCircleOutlined className="mr-1" />
                安全注册
              </div>
              <div className="flex items-center">
                <CheckCircleOutlined className="mr-1" />
                数据保护
              </div>
              <div className="flex items-center">
                <CheckCircleOutlined className="mr-1" />
                隐私优先
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
