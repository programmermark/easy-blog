"use client";

import { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Input,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Category, Post, Tag as TagType } from "@/types";
import requestClient from "@/lib/request-client";
import PostForm from "@/components/PostForm";

export default function PostsPage() {
  const router = useRouter();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const queryClient = useQueryClient();

  // 获取文章列表
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["posts", searchText, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchText) params.append("search", searchText);
      if (statusFilter) params.append("status", statusFilter);

      const response = await requestClient.get(`/posts?${params.toString()}`);
      console.log(response.data);
      return response.data;
    },
  });

  // 获取分类和标签
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await requestClient.get("/categories");
      return response.data;
    },
  });

  const { data: tags } = useQuery<TagType[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await requestClient.get("/tags");
      return response.data;
    },
  });

  // 删除文章
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      await requestClient.delete(`/posts/${id}`);
    },
    onSuccess: () => {
      message.success("文章删除成功");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      message.error("文章删除失败");
    },
  });

  // 创建/更新文章
  const savePostMutation = useMutation({
    mutationFn: async (postData: Partial<Post>) => {
      if (editingPost) {
        await requestClient.put(`/posts/${editingPost.id}`, postData);
      } else {
        await requestClient.post("/posts", postData);
      }
    },
    onSuccess: () => {
      message.success(editingPost ? "文章更新成功" : "文章创建成功");
      setIsFormVisible(false);
      setEditingPost(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      message.error("操作失败");
    },
  });

  const handleEdit = (post: Post) => {
    router.push(`/admin/posts/${post.id}/edit`);
  };

  const handleDelete = (id: string) => {
    deletePostMutation.mutate(id);
  };

  const handleFormSubmit = async (values: Partial<Post>) => {
    savePostMutation.mutate(values);
  };

  const handleCreate = () => {
    router.push("/admin/posts/create");
  };

  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Post) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.slug}</div>
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap = {
          DRAFT: { color: "default", text: "草稿" },
          PUBLISHED: { color: "success", text: "已发布" },
          ARCHIVED: { color: "warning", text: "已归档" },
        };
        const config = statusMap[status as keyof typeof statusMap] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Post) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这篇文章吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">文章管理</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建文章
          </Button>
        </div>

        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="搜索文章标题..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="选择状态"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            allowClear
          >
            <Select.Option value="DRAFT">草稿</Select.Option>
            <Select.Option value="PUBLISHED">已发布</Select.Option>
            <Select.Option value="ARCHIVED">已归档</Select.Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={postsData?.posts || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          total: postsData?.pagination?.total || 0,
          pageSize: postsData?.pagination?.limit || 10,
          current: postsData?.pagination?.page || 1,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      {isFormVisible && (
        <PostForm
          post={editingPost || undefined}
          categories={categories || []}
          tags={tags || []}
          onSubmit={handleFormSubmit}
          loading={savePostMutation.isPending}
        />
      )}
    </div>
  );
}
