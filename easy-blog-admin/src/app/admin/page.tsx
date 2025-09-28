"use client";

import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Progress,
  List,
  Avatar,
  Tag,
} from "antd";
import {
  BookOutlined,
  FolderOutlined,
  TagsOutlined,
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  LikeOutlined,
  CommentOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  // 模拟数据
  const statsData = [
    {
      title: "总文章数",
      value: 12,
      prefix: <BookOutlined />,
      color: "#1890ff",
      trend: { value: 12.5, isPositive: true },
    },
    {
      title: "分类数量",
      value: 8,
      prefix: <FolderOutlined />,
      color: "#52c41a",
      trend: { value: 2.1, isPositive: true },
    },
    {
      title: "标签数量",
      value: 24,
      prefix: <TagsOutlined />,
      color: "#722ed1",
      trend: { value: 5.2, isPositive: true },
    },
    {
      title: "总浏览量",
      value: 1234,
      prefix: <EyeOutlined />,
      color: "#f5222d",
      trend: { value: 8.3, isPositive: true },
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: "Next.js 14 新特性详解",
      status: "published",
      views: 156,
      likes: 23,
      comments: 8,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "React 18 并发特性实践",
      status: "draft",
      views: 89,
      likes: 12,
      comments: 3,
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      title: "TypeScript 高级类型技巧",
      status: "published",
      views: 234,
      likes: 45,
      comments: 12,
      createdAt: "2024-01-13",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "green";
      case "draft":
        return "orange";
      case "archived":
        return "gray";
      default:
        return "blue";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "已发布";
      case "draft":
        return "草稿";
      case "archived":
        return "已归档";
      default:
        return "未知";
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <Title level={2} className="mb-2">
          仪表板
        </Title>
        <Text type="secondary">欢迎回来！这里是您的博客管理概览。</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]}>
        {statsData.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix}
                valueStyle={{ color: item.color }}
                suffix={
                  <Space size={4}>
                    {item.trend.isPositive ? (
                      <RiseOutlined style={{ color: "#52c41a" }} />
                    ) : (
                      <FallOutlined style={{ color: "#f5222d" }} />
                    )}
                    <Text
                      type={item.trend.isPositive ? "success" : "danger"}
                      className="text-xs"
                    >
                      {item.trend.value}%
                    </Text>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 内容区域 */}
      <Row gutter={[24, 24]}>
        {/* 最近文章 */}
        <Col xs={24} lg={16}>
          <Card
            title="最近文章"
            extra={<Text type="secondary">共 {recentPosts.length} 篇文章</Text>}
            className="h-full"
          >
            <List
              dataSource={recentPosts}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Space key="views">
                      <EyeOutlined />
                      <Text type="secondary">{item.views}</Text>
                    </Space>,
                    <Space key="likes">
                      <LikeOutlined />
                      <Text type="secondary">{item.likes}</Text>
                    </Space>,
                    <Space key="comments">
                      <CommentOutlined />
                      <Text type="secondary">{item.comments}</Text>
                    </Space>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<BookOutlined />} />}
                    title={
                      <Space>
                        <Text strong>{item.title}</Text>
                        <Tag color={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <CalendarOutlined />
                        <Text type="secondary">{item.createdAt}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 快速操作和统计 */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" className="w-full">
            {/* 快速操作 */}
            <Card title="快速操作" size="small">
              <Space direction="vertical" size="middle" className="w-full">
                <div className="text-center py-4">
                  <Text type="secondary">开始创建您的下一篇精彩文章</Text>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <BookOutlined className="text-blue-500 text-xl mb-2" />
                    <div className="text-sm font-medium">写文章</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <FolderOutlined className="text-green-500 text-xl mb-2" />
                    <div className="text-sm font-medium">管理分类</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <TagsOutlined className="text-purple-500 text-xl mb-2" />
                    <div className="text-sm font-medium">管理标签</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <UserOutlined className="text-orange-500 text-xl mb-2" />
                    <div className="text-sm font-medium">个人设置</div>
                  </div>
                </div>
              </Space>
            </Card>

            {/* 系统状态 */}
            <Card title="系统状态" size="small">
              <Space direction="vertical" size="middle" className="w-full">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Text>存储使用率</Text>
                    <Text type="secondary">65%</Text>
                  </div>
                  <Progress percent={65} size="small" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Text>系统性能</Text>
                    <Text type="secondary">良好</Text>
                  </div>
                  <Progress percent={85} size="small" status="active" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Text>响应时间</Text>
                    <Text type="secondary">120ms</Text>
                  </div>
                  <Progress percent={90} size="small" />
                </div>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
