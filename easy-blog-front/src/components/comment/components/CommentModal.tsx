"use client";

import { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import { UserOutlined, MailOutlined, GlobalOutlined } from "@ant-design/icons";
import { env } from "@/env";

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess?: (visitor: any) => void;
}

interface LoginForm {
  nickname: string;
  email: string;
  site?: string;
}

export default function CommentModal({
  open,
  onClose,
  onLoginSuccess,
}: CommentModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 调用访客登录API
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_BASE_URL}/visitor/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickname: values.nickname,
            email: values.email,
            site: values.site || "",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          message.success("登录成功");
          onLoginSuccess?.(data.data);
          onClose();
          form.resetFields();
        } else {
          message.error(data.message || "登录失败");
        }
      } else {
        message.error("登录失败，请稍后重试");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("登录失败，请检查输入信息");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="text-base text-gray-800 font-semibold">发表评论</div>
      }
      open={open}
      onCancel={handleCancel}
      width={300}
      footer={[
        <Button
          key="submit"
          type="primary"
          size="small"
          loading={loading}
          onClick={handleLogin}
          className="w-full"
        >
          提交
        </Button>,
      ]}
    >
      <Form form={form} size="small" layout="vertical" className="mt-4">
        <Form.Item
          name="nickname"
          rules={[{ required: true, message: "昵称不能为空" }]}
        >
          <Input
            placeholder="昵称(必填)"
            prefix={<UserOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "邮箱不能为空" },
            { type: "email", message: "邮箱格式不正确" },
          ]}
        >
          <Input
            placeholder="邮箱(必填)"
            prefix={<MailOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item name="site">
          <Input
            placeholder="个人网站(选填)"
            prefix={<GlobalOutlined className="text-gray-400" />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
