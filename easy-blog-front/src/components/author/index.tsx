"use client";

import { api } from "@/api";
import { requestClient } from "@/lib/request-client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { UserInfo } from "./type";
import { Avatar, Popover, Spin } from "antd";
import { env } from "@/env";
import {
  GithubOutlined,
  WechatOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import profileBg from "@/assets/image/profile-bg.jpg";

// 格式化数字为文本
const formatNumberToText = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 10000) return `${(num / 1000).toFixed(1)}k`;
  if (num < 100000) return `${(num / 10000).toFixed(1)}w`;
  return `${(num / 100000).toFixed(1)}十万`;
};

// 跳转到关于页面
const gotoAboutPage = () => {
  // 这里可以添加路由跳转逻辑
  console.log("跳转到关于页面");
};

export default function Author() {
  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ["fetchUserInfo"],
    queryFn: () => requestClient.get<UserInfo>(api.home.fetchUserInfo),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  // 模拟一些统计数据（实际项目中应该从其他接口获取）
  const mockStats = {
    articleCount: 42,
    viewCount: 12800,
  };

  if (queryLoading || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <Spin size="default" />
        <p className="mt-2 text-gray-500">加载作者信息...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-lg shadow-sm">
      {/* 背景图片区域 */}
      <div
        className="w-full h-20 rounded-t-lg relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {data.backgroundImage ? (
          <Image
            src={
              data.backgroundImage.startsWith("http")
                ? data.backgroundImage
                : `${env.NEXT_PUBLIC_API_URL}${data.backgroundImage}`
            }
            alt="背景图片"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        ) : data.avatarBase64 ? (
          <Image
            src={
              data.avatarBase64.startsWith("http")
                ? data.avatarBase64
                : `${env.NEXT_PUBLIC_API_URL}${data.avatarBase64}`
            }
            alt="头像背景"
            fill
            style={{
              objectFit: "cover",
            }}
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

      {/* 头像和用户名 */}
      <div
        className="flex items-center relative left-6 top-[-20px] cursor-pointer"
        onClick={gotoAboutPage}
      >
        <Avatar
          size={64}
          src={
            data.avatarBase64
              ? data.avatarBase64.startsWith("http")
                ? data.avatarBase64
                : `${env.NEXT_PUBLIC_API_URL}${data.avatarBase64}`
              : undefined
          }
          icon={<UserOutlined />}
          className="border-2 border-white shadow-md"
        />
        <span className="ml-2 text-lg font-medium text-gray-700 relative top-[8px]">
          {data.nickname || "博主"}
        </span>
      </div>

      {/* 文章统计 */}
      <div className="flex mx-8 mt-2">
        <div className="flex-1 text-center">
          <p className="mb-2 text-[15px] font-medium text-blue-500">
            {mockStats.articleCount}
          </p>
          <p className="mb-2 text-[15px] font-medium text-gray-500">文章</p>
        </div>
      </div>

      {/* 社交账号 */}
      <div className="px-4 py-2">
        <div className="border-t border-gray-200 pt-4">
          <div className="text-center mb-3">
            <span className="text-base text-gray-600">社交账号</span>
          </div>
          <div className="flex items-center justify-center space-x-8">
            {data.github && (
              <Popover
                content={
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mt-1 break-all">
                      {data.github}
                    </div>
                  </div>
                }
              >
                <a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Avatar
                    size={32}
                    icon={<GithubOutlined />}
                    className="group-hover:bg-gray-100 transition-colors cursor-pointer"
                  />
                </a>
              </Popover>
            )}

            {data.wechat && (
              <Popover
                content={
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mt-1">
                      {data.wechat}
                    </div>
                  </div>
                }
              >
                <div className="group cursor-pointer">
                  <Avatar
                    size={32}
                    icon={<WechatOutlined />}
                    className="group-hover:bg-gray-100 transition-colors"
                  />
                </div>
              </Popover>
            )}

            {data.email && (
              <Popover
                content={
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mt-1 break-all">
                      {data.email}
                    </div>
                  </div>
                }
              >
                <a href={`mailto:${data.email}`} className="group">
                  <Avatar
                    size={32}
                    icon={<MailOutlined />}
                    className="group-hover:bg-gray-100 transition-colors cursor-pointer"
                  />
                </a>
              </Popover>
            )}
          </div>
        </div>
      </div>

      {/* 访问量 */}
      <div className="px-4 pb-4 border-t border-gray-200">
        <span className="inline-block px-2 py-1 mt-3 mr-1 text-xs text-blue-400 bg-blue-100 border border-blue-200 rounded-md">
          被访问{formatNumberToText(mockStats.viewCount)}次
        </span>
      </div>
    </div>
  );
}
