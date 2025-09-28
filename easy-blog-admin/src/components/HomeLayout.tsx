"use client";

import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
} from "antd";
import { useRouter, usePathname } from "next/navigation";
import {
  UserOutlined,
  LogoutOutlined,
  BookOutlined,
  TagsOutlined,
  FolderOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  DashboardOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Link from "next/link";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "首页",
    },
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "管理后台",
    },
    {
      key: "/admin/posts",
      icon: <BookOutlined />,
      label: "文章管理",
    },
    {
      key: "/admin/categories",
      icon: <FolderOutlined />,
      label: "分类管理",
    },
    {
      key: "/admin/tags",
      icon: <TagsOutlined />,
      label: "标签管理",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const userMenuItems = isAuthenticated
    ? [
        {
          key: "profile",
          icon: <UserOutlined />,
          label: "个人资料",
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "退出登录",
          onClick: handleLogout,
        },
      ]
    : [
        {
          key: "login",
          icon: <LoginOutlined />,
          label: "登录",
          onClick: () => router.push("/login"),
        },
        {
          key: "register",
          icon: <UserAddOutlined />,
          label: "注册",
          onClick: () => router.push("/register"),
        },
      ];

  return (
    <Layout className="full-height-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={256}
        className="shadow-lg full-height-sider"
        theme="light"
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            {!collapsed && (
              <Text strong className="text-lg text-gray-800">
                博客管理后台
              </Text>
            )}
          </div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0"
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout className="full-height-content">
        <Header
          className="bg-white shadow-sm border-b border-gray-200 px-6 flex items-center justify-between"
          style={{ height: "64px" }}
        >
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-600 hover:text-gray-900"
            />
            <Text strong className="text-lg">
              {pathname === "/" ? "首页" : "博客管理后台"}
            </Text>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button
                  type="text"
                  className="flex items-center space-x-2 h-12 px-3 hover:bg-gray-50"
                >
                  <Avatar size="small" icon={<UserOutlined />} />
                  <div className="flex flex-col items-start">
                    <Text strong className="text-sm">
                      {user?.name}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      {user?.role}
                    </Text>
                  </div>
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Button type="text" onClick={() => router.push("/login")}>
                  登录
                </Button>
                <Button type="primary" onClick={() => router.push("/register")}>
                  注册
                </Button>
              </Space>
            )}
          </div>
        </Header>

        <Content className="full-height-content-area">
          <div className="full-height-card">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
