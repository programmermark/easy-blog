"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Upload,
  message,
  Space,
  Typography,
  Row,
  Col,
  Divider,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import requestClient from "@/lib/request-client";
import profileBg from "@/assets/image/profile-bg.jpg";

const { Title, Text } = Typography;

const PROFILE_STORAGE_KEY = "easy_blog_admin_profile";

type ProfileData = {
  nickname: string;
  wechat: string;
  phone: string;
  email: string;
  github: string;
  avatarBase64?: string;
  backgroundImage?: string;
};

const resolveAssetUrl = (url?: string) => {
  if (!url) return url;
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : `/${url}`;
};

export default function AdminProfilePage() {
  const [form] = Form.useForm<ProfileData>();
  const [submitting, setSubmitting] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState<string | undefined>();
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>();

  // Load from backend (fallback to localStorage)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await requestClient.get("/profile");
        form.setFieldsValue(data);
        setAvatarBase64(data.avatarBase64);
        setBackgroundImage(data.backgroundImage);
      } catch (e) {
        try {
          const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
          if (raw) {
            const cached = JSON.parse(raw) as ProfileData;
            form.setFieldsValue(cached);
            setAvatarBase64(cached.avatarBase64);
            setBackgroundImage(cached.backgroundImage);
          }
        } catch {}
      }
    })();
  }, [form]);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) message.error("只能上传图片文件");
    if (!isLt2M) message.error("图片大小需小于 2MB");
    return isImage && isLt2M;
  };

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await requestClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { url } = response.data;
      setAvatarBase64(url); // 存储URL而不是base64
      onSuccess?.(null, file);
    } catch (err) {
      console.error("Upload failed:", err);
      onError?.(err);
    }
  };

  const onFinish = async (values: ProfileData) => {
    setSubmitting(true);
    try {
      const payload: ProfileData = { ...values, avatarBase64, backgroundImage };
      await requestClient.put("/profile", payload);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(payload));
      message.success("保存成功");
    } catch (e) {
      message.error("保存失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues: Partial<ProfileData> = useMemo(
    () => ({ nickname: "", wechat: "", phone: "", email: "", github: "" }),
    []
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2} className="!mb-2">
          个人信息设置
        </Title>
        <Text type="secondary">
          配置将用于博客前台作者信息展示，这些信息将在文章详情页和关于页面中显示。
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="基本信息" className="mb-6">
            <Form
              form={form}
              layout="vertical"
              initialValues={initialValues}
              onFinish={onFinish}
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="nickname"
                    label="昵称"
                    rules={[{ required: true, message: "请输入昵称" }]}
                  >
                    <Input placeholder="对外展示的昵称" allowClear />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="wechat" label="微信号">
                    <Input placeholder="用于展示或联系" allowClear />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="手机号"
                    rules={[
                      {
                        pattern: /^\+?\d{6,20}$/,
                        message: "请输入正确的手机号",
                      },
                    ]}
                  >
                    <Input placeholder="示例：+8613800138000" allowClear />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[{ type: "email", message: "请输入正确的邮箱" }]}
                  >
                    <Input placeholder="example@domain.com" allowClear />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="github"
                label="GitHub 主页"
                rules={[{ type: "url", message: "请输入正确的 URL" }]}
              >
                <Input placeholder="https://github.com/yourname" allowClear />
              </Form.Item>

              <Divider />

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<SaveOutlined />}
                  >
                    保存设置
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setAvatarBase64(undefined);
                    }}
                    icon={<ReloadOutlined />}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="头像设置" className="mb-6">
            <div className="text-center">
              <div
                className="mx-auto mb-4"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 8,
                  background: "#f5f5f5",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #eee",
                }}
              >
                {avatarBase64 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveAssetUrl(avatarBase64)!}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Text type="secondary">预览</Text>
                )}
              </div>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={customRequest}
              >
                <Button icon={<UploadOutlined />} block>
                  上传头像
                </Button>
              </Upload>
              <Text type="secondary" className="block mt-2 text-xs">
                支持 JPG、PNG 格式，文件大小不超过 2MB
              </Text>
            </div>
          </Card>

          <Card title="背景图片设置" className="mb-6">
            <div className="text-center">
              <div
                className="mx-auto mb-4"
                style={{
                  width: "100%",
                  height: 120,
                  borderRadius: 8,
                  background: "#f5f5f5",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #eee",
                  position: "relative",
                }}
              >
                {backgroundImage ? (
                  <Image
                    src={resolveAssetUrl(backgroundImage)!}
                    alt="background"
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    sizes="100vw"
                  />
                ) : (
                  <Image
                    src={profileBg}
                    alt="默认背景图片"
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={async ({ file, onSuccess, onError }: any) => {
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const response = await requestClient.post(
                      "/upload",
                      formData,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );

                    const { url } = response.data;
                    console.log(url);
                    setBackgroundImage(url);
                    onSuccess?.(null, file);
                  } catch (err) {
                    console.error("Upload failed:", err);
                    onError?.(err);
                  }
                }}
              >
                <Button icon={<UploadOutlined />} block>
                  上传背景图片
                </Button>
              </Upload>
              <Text type="secondary" className="block mt-2 text-xs">
                支持 JPG、PNG 格式，文件大小不超过 2MB
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
