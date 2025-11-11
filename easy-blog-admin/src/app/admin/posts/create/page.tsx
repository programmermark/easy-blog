"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Space, message, Typography, Breadcrumb } from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Post, Category, Tag } from "@/types";
import requestClient from "@/lib/request-client";
import PostForm from "@/components/PostForm";
import { ADMIN_APP_RELATIVE_BASE_PATH } from "@/config/basePath";

const { Title } = Typography;

export default function CreatePostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 获取分类和标签
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await requestClient.get("/categories");
      return response.data;
    },
  });

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await requestClient.get("/tags");
      return response.data;
    },
  });

  const handleSubmit = async (values: Partial<Post>) => {
    setIsSubmitting(true);
    try {
      await requestClient.post("/posts", values);
      message.success("文章创建成功");
      router.push(`${ADMIN_APP_RELATIVE_BASE_PATH}/posts`);
    } catch (error: any) {
      message.error(error.response?.data?.message || "创建失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (values: Partial<Post>) => {
    setIsSubmitting(true);
    try {
      await requestClient.post("/posts", { ...values, status: "DRAFT" });
      message.success("草稿保存成功");
      router.push(`${ADMIN_APP_RELATIVE_BASE_PATH}/posts`);
    } catch (error: any) {
      message.error(error.response?.data?.message || "保存失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = (values: Partial<Post>) => {
    // TODO: 实现预览功能
    console.log("预览数据:", values);
    message.info("预览功能开发中...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Breadcrumb
                items={[
                  { title: "首页", href: "/" },
                  {
                    title: "文章管理",
                    href: `${ADMIN_APP_RELATIVE_BASE_PATH}/posts`,
                  },
                  { title: "创建文章" },
                ]}
                className="mb-2"
              />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FileTextOutlined className="text-white text-sm" />
                </div>
                <div>
                  <Title level={2} className="!mb-1 !text-gray-900">
                    创建文章
                  </Title>
                  <p className="text-gray-500 text-sm">
                    撰写一篇新的博客文章，分享你的想法和见解
                  </p>
                </div>
              </div>
            </div>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                className="border-gray-300"
              >
                返回
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* 左侧表单区域 */}
          <div className="xl:col-span-3">
            <PostForm
              categories={categories}
              tags={tags}
              onSubmit={handleSubmit}
              onSaveDraft={handleSaveDraft}
              onPreview={handlePreview}
              loading={isSubmitting}
              showActions={true}
            />
          </div>

          {/* 右侧辅助信息 */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* 写作提示卡片 */}
              <Card
                title="写作提示"
                size="small"
                className="shadow-sm"
                styles={{
                  header: {
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    fontSize: "14px",
                    fontWeight: 600,
                  },
                }}
              >
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>标题要简洁明了，能够吸引读者注意</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>摘要可以帮助读者快速了解文章内容</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>选择合适的分类和标签便于文章管理</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>可以先保存草稿，稍后继续编辑</span>
                  </div>
                </div>
              </Card>

              {/* 快速操作 */}
              <Card
                title="快速操作"
                size="small"
                className="shadow-sm"
                styles={{
                  header: {
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    fontSize: "14px",
                    fontWeight: 600,
                  },
                }}
              >
                <div className="space-y-2">
                  <Button
                    block
                    size="small"
                    icon={<SaveOutlined />}
                    onClick={() => {
                      const form = document.querySelector("form");
                      if (form) {
                        const formData = new FormData(form);
                        // 这里可以添加快速保存草稿的逻辑
                        message.info("快速保存功能开发中...");
                      }
                    }}
                  >
                    快速保存
                  </Button>
                  <Button
                    block
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => message.info("预览功能开发中...")}
                  >
                    预览文章
                  </Button>
                </div>
              </Card>

              {/* 统计信息 */}
              <Card
                title="文章统计"
                size="small"
                className="shadow-sm"
                styles={{
                  header: {
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    fontSize: "14px",
                    fontWeight: 600,
                  },
                }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">分类数量</span>
                    <span className="text-sm font-medium text-blue-600">
                      {categories.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">标签数量</span>
                    <span className="text-sm font-medium text-green-600">
                      {tags.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">状态</span>
                    <span className="text-sm font-medium text-orange-600">
                      草稿
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
