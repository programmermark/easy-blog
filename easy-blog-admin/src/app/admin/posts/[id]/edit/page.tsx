"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  Button,
  Space,
  message,
  Typography,
  Breadcrumb,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EyeOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Post, Category, Tag } from "../../../../../types/index";
import api from "../../../../../lib/api";
import PostForm from "../../../../../components/PostForm";

const { Title } = Typography;

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const postId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 获取文章详情
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    },
    enabled: !!postId,
  });

  // 获取分类和标签
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data;
    },
  });

  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await api.get("/tags");
      return response.data;
    },
  });

  // 更新文章
  const updatePostMutation = useMutation({
    mutationFn: async (values: Partial<Post>) => {
      const response = await api.put(`/posts/${postId}`, values);
      return response.data;
    },
    onSuccess: () => {
      message.success("文章更新成功");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      router.push("/admin/posts");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "更新失败");
    },
  });

  const handleSubmit = async (values: Partial<Post>) => {
    setIsSubmitting(true);
    try {
      await updatePostMutation.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (values: Partial<Post>) => {
    setIsSubmitting(true);
    try {
      await updatePostMutation.mutateAsync({ ...values, status: "DRAFT" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = (values: Partial<Post>) => {
    // TODO: 实现预览功能
    console.log("预览数据:", values);
    message.info("预览功能开发中...");
  };

  if (postLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <Title level={3}>文章不存在</Title>
        <Button type="primary" onClick={() => router.push("/admin/posts")}>
          返回文章列表
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb
            items={[
              { title: "首页", href: "/" },
              { title: "文章管理", href: "/admin/posts" },
              { title: "编辑文章" },
            ]}
          />
          <Title level={2} className="mt-2 mb-0">
            编辑文章
          </Title>
        </div>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            返回
          </Button>
        </Space>
      </div>

      {/* 文章表单 */}
      <PostForm
        post={post}
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        onPreview={handlePreview}
        loading={isSubmitting}
        showActions={true}
      />
    </div>
  );
}
