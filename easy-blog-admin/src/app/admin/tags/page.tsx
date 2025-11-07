"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Input,
  Modal,
  Form,
  ColorPicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tag as TagType } from "@/types";
import api from "@/lib/api";

export default function TagsPage() {
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  // 获取标签列表
  const { data: tagsData, isLoading } = useQuery({
    queryKey: ["tags", searchText],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchText) params.append("search", searchText);

      const response = await api.get(`/tags?${params.toString()}`);
      return response.data;
    },
  });

  // 删除标签
  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tags/${id}`);
    },
    onSuccess: () => {
      message.success("标签删除成功");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: () => {
      message.error("标签删除失败");
    },
  });

  // 创建/更新标签
  const saveTagMutation = useMutation({
    mutationFn: async (tagData: Partial<TagType>) => {
      if (editingTag) {
        await api.put(`/tags/${editingTag.id}`, tagData);
      } else {
        await api.post("/tags", tagData);
      }
    },
    onSuccess: () => {
      message.success(editingTag ? "标签更新成功" : "标签创建成功");
      setIsFormVisible(false);
      setEditingTag(null);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: () => {
      message.error("操作失败");
    },
  });

  const handleEdit = (tag: TagType) => {
    setEditingTag(tag);
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteTagMutation.mutate(id);
  };

  const handleFormSubmit = async (values: Partial<TagType>) => {
    saveTagMutation.mutate(values);
  };

  const handleCreate = () => {
    setEditingTag(null);
    setIsFormVisible(true);
  };

  // 监听 editingTag 变化，重置表单数据
  useEffect(() => {
    if (isFormVisible) {
      if (editingTag) {
        // 编辑模式：设置表单值为当前编辑的标签数据
        form.setFieldsValue(editingTag);
      } else {
        // 创建模式：清空表单
        form.resetFields();
      }
    }
  }, [editingTag, isFormVisible, form]);

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: TagType) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.slug}</div>
        </div>
      ),
    },
    {
      title: "颜色",
      dataIndex: "color",
      key: "color",
      render: (color: string) =>
        color ? <Tag color={color}>{color}</Tag> : "-",
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: TagType) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个标签吗？"
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
          <h1 className="text-2xl font-bold">标签管理</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建标签
          </Button>
        </div>

        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="搜索标签名称..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={tagsData?.data || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          total: tagsData?.data?.length || 0,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingTag ? "编辑标签" : "创建标签"}
        open={isFormVisible}
        onCancel={() => setIsFormVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={editingTag || undefined}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入标签名称" }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>

          <Form.Item
            label="URL 别名"
            name="slug"
            rules={[{ required: true, message: "请输入 URL 别名" }]}
          >
            <Input placeholder="请输入 URL 别名" />
          </Form.Item>

          <Form.Item label="颜色" name="color">
            <div className="flex items-center space-x-2">
              <ColorPicker
                showText
                format="hex"
                onChange={(color) => {
                  // 获取颜色值并更新表单
                  const colorValue = color.toHexString();
                  form.setFieldValue("color", colorValue);
                }}
              />
              <Input
                placeholder="或手动输入颜色代码，如：#1890ff"
                style={{ flex: 1 }}
                onChange={(e) => {
                  // 当手动输入时，同步更新颜色选择器
                  const value = e.target.value;
                  if (value && /^#[0-9A-Fa-f]{6}$/.test(value)) {
                    form.setFieldValue("color", value);
                  }
                }}
              />
            </div>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={saveTagMutation.isPending}
              >
                {editingTag ? "更新" : "创建"}
              </Button>
              <Button onClick={() => setIsFormVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
