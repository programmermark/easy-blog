"use client";

import { useState, useRef, useEffect } from "react";
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
import { ApiResponse, Category } from "@/types";
import requestClient from "@/lib/request-client";

export default function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  // 获取分类列表
  const { data: categoriesData, isLoading } = useQuery<Category[]>({
    queryKey: ["categories", searchText],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchText) params.append("search", searchText);

      const response = await requestClient.get(
        `/categories?${params.toString()}`
      );
      console.log(response.data);
      return response.data;
    },
  });

  // 删除分类
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await requestClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      message.success("分类删除成功");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error("分类删除失败");
    },
  });

  // 创建/更新分类
  const saveCategoryMutation = useMutation({
    mutationFn: async (categoryData: Partial<Category>) => {
      if (editingCategory) {
        await requestClient.patch(
          `/categories/${editingCategory.id}`,
          categoryData
        );
      } else {
        await requestClient.post("/categories", categoryData);
      }
    },
    onSuccess: () => {
      message.success(editingCategory ? "分类更新成功" : "分类创建成功");
      setIsFormVisible(false);
      setEditingCategory(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error("操作失败");
    },
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  const handleFormSubmit = async (values: Partial<Category>) => {
    saveCategoryMutation.mutate(values);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormVisible(true);
  };

  // 监听 editingCategory 变化，重置表单数据
  useEffect(() => {
    if (isFormVisible) {
      if (editingCategory) {
        // 编辑模式：设置表单值为当前编辑的分类数据
        form.setFieldsValue(editingCategory);
      } else {
        // 创建模式：清空表单
        form.resetFields();
      }
    }
  }, [editingCategory, isFormVisible, form]);

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Category) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.slug}</div>
        </div>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
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
      render: (_: unknown, record: Category) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个分类吗？"
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
          <h1 className="text-2xl font-bold">分类管理</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建分类
          </Button>
        </div>

        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="搜索分类名称..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={categoriesData || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          total: categoriesData?.length || 0,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingCategory ? "编辑分类" : "创建分类"}
        open={isFormVisible}
        onCancel={() => setIsFormVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={editingCategory || undefined}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入分类名称" }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item
            label="URL 别名"
            name="slug"
            rules={[{ required: true, message: "请输入 URL 别名" }]}
          >
            <Input placeholder="请输入 URL 别名" />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea placeholder="请输入分类描述" rows={3} />
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
                loading={saveCategoryMutation.isPending}
              >
                {editingCategory ? "更新" : "创建"}
              </Button>
              <Button onClick={() => setIsFormVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
