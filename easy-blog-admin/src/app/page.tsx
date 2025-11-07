"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Tag,
} from "antd";
import {
  BookOutlined,
  LoginOutlined,
  DashboardOutlined,
  UserAddOutlined,
  EyeOutlined,
  LikeOutlined,
  CommentOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { useAuthCheck } from "../hooks/useAuthCheck";
import HomeLayout from "../components/HomeLayout";

const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  // 在应用启动时检查认证状态
  useAuthCheck();

  useEffect(() => {
    // 只有在状态恢复完成且已认证时才跳转
    if (isHydrated && isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isHydrated, router]);

  // 模拟博客数据
  const blogStats = [
    {
      title: "总文章数",
      value: 156,
      prefix: <BookOutlined />,
      color: "#1890ff",
      trend: { value: 12.5, isPositive: true },
    },
    {
      title: "总浏览量",
      value: 12340,
      prefix: <EyeOutlined />,
      color: "#52c41a",
      trend: { value: 8.3, isPositive: true },
    },
    {
      title: "总点赞数",
      value: 2340,
      prefix: <LikeOutlined />,
      color: "#f5222d",
      trend: { value: 15.2, isPositive: true },
    },
    {
      title: "总评论数",
      value: 890,
      prefix: <CommentOutlined />,
      color: "#722ed1",
      trend: { value: 5.7, isPositive: true },
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: "Next.js 14 新特性详解",
      summary:
        "深入探讨 Next.js 14 带来的新特性和改进，包括 App Router、Server Components 等...",
      author: "张三",
      views: 156,
      likes: 23,
      comments: 8,
      createdAt: "2024-01-15",
      tags: ["Next.js", "React", "前端"],
    },
    {
      id: 2,
      title: "React 18 并发特性实践",
      summary: "学习如何使用 React 18 的并发特性来提升应用性能和用户体验...",
      author: "李四",
      views: 89,
      likes: 12,
      comments: 3,
      createdAt: "2024-01-14",
      tags: ["React", "JavaScript", "前端"],
    },
    {
      id: 3,
      title: "TypeScript 高级类型技巧",
      summary: "掌握 TypeScript 的高级类型系统，提升代码质量和开发效率...",
      author: "王五",
      views: 234,
      likes: 45,
      comments: 12,
      createdAt: "2024-01-13",
      tags: ["TypeScript", "编程", "前端"],
    },
  ];

  return (
    <HomeLayout>
      <div className="space-y-8">
        {/* 欢迎区域 */}
        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <Title level={1} className="text-5xl font-bold text-gray-800 mb-4">
            欢迎来到博客管理后台
          </Title>
          <Paragraph className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            基于 Next.js + Ant Design
            的现代化博客管理系统，让内容创作更简单、更高效
          </Paragraph>
          {!isAuthenticated && (
            <Space size="large">
              <Button
                type="primary"
                size="large"
                icon={<LoginOutlined />}
                onClick={() => router.push("/login")}
              >
                立即登录
              </Button>
              <Button
                size="large"
                icon={<UserAddOutlined />}
                onClick={() => router.push("/register")}
              >
                注册账户
              </Button>
            </Space>
          )}
        </div>

        {/* 统计概览 */}
        <div>
          <Title level={3} className="mb-6">
            数据概览
          </Title>
          <Row gutter={[24, 24]}>
            {blogStats.map((item, index) => (
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
        </div>

        {/* 功能特色 */}
        <div>
          <Title level={3} className="mb-6">
            功能特色
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <BookOutlined className="text-4xl text-blue-500 mb-4" />
                <Title level={4}>文章管理</Title>
                <Paragraph>
                  创建、编辑、发布和管理您的博客文章，支持富文本编辑和 Markdown
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <DashboardOutlined className="text-4xl text-green-500 mb-4" />
                <Title level={4}>分类标签</Title>
                <Paragraph>
                  组织您的内容，创建分类和标签系统，让读者更容易找到感兴趣的内容
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <LoginOutlined className="text-4xl text-purple-500 mb-4" />
                <Title level={4}>安全认证</Title>
                <Paragraph>
                  安全的用户认证系统，保护您的管理后台和数据安全
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* 最新文章 */}
        <div>
          <Title level={3} className="mb-6">
            最新文章
          </Title>
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
                      <Text strong className="text-lg">
                        {item.title}
                      </Text>
                      <Space>
                        {item.tags.map((tag) => (
                          <Tag key={tag} color="blue">
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    </Space>
                  }
                  description={
                    <div>
                      <Paragraph className="mb-2">{item.summary}</Paragraph>
                      <Space>
                        <Text type="secondary">作者：{item.author}</Text>
                        <CalendarOutlined />
                        <Text type="secondary">{item.createdAt}</Text>
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>

        {/* 技术栈 */}
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Title level={4} className="mb-4">
            技术栈
          </Title>
          <Space wrap>
            <Tag color="blue">Next.js 14</Tag>
            <Tag color="green">TypeScript</Tag>
            <Tag color="purple">Ant Design 5</Tag>
            <Tag color="orange">Zustand</Tag>
            <Tag color="cyan">Tiptap</Tag>
            <Tag color="red">Axios</Tag>
          </Space>
        </div>
      </div>
    </HomeLayout>
  );
}
