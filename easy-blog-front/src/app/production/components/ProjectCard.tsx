"use client";

import { useState } from "react";
import { Button, Tag, Tooltip, message } from "antd";
import {
  LinkOutlined,
  GithubOutlined,
  EyeOutlined,
  StarOutlined,
  ForkOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { IProject } from "../type";

interface ProjectCardProps {
  project: IProject;
  onPreview: () => void;
  onGithub: () => void;
}

export function ProjectCard({
  project,
  onPreview,
  onGithub,
}: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "development":
        return "blue";
      case "completed":
        return "gray";
      case "archived":
        return "red";
      default:
        return "default";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "开源项目":
        return "blue";
      case "持续迭代中":
        return "orange";
      case "商业项目":
        return "purple";
      case "学习项目":
        return "cyan";
      default:
        return "default";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* 项目封面图 */}
        <div className="md:w-80 md:flex-shrink-0">
          <div className="relative h-48 md:h-full bg-gray-100">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="text-center text-gray-500">
                  <EyeOutlined className="text-4xl mb-2" />
                  <p className="text-sm">图片加载失败</p>
                </div>
              </div>
            ) : (
              <img
                src={project.coverUrl}
                alt={project.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}

            {/* 项目状态标签 */}
            <div className="absolute top-3 left-3">
              <Tag color={getStatusColor(project.status)}>
                {project.status === "active" && "活跃"}
                {project.status === "development" && "开发中"}
                {project.status === "completed" && "已完成"}
                {project.status === "archived" && "已归档"}
              </Tag>
            </div>
          </div>
        </div>

        {/* 项目信息 */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            {/* 项目标题和类型 */}
            <div className="mb-3">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <Tag color={getTypeColor(project.type)}>{project.type}</Tag>
              </div>
            </div>

            {/* 项目描述 */}
            <div className="flex-1 mb-4">
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {project.summary}
              </p>
            </div>

            {/* 技术栈 */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 6).map((tech) => (
                  <Tag key={tech} color="blue">
                    {tech}
                  </Tag>
                ))}
                {project.technologies.length > 6 && (
                  <Tooltip title={project.technologies.slice(6).join(", ")}>
                    <Tag color="default">
                      +{project.technologies.length - 6}
                    </Tag>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* 项目统计 */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              {project.stars !== undefined && (
                <div className="flex items-center gap-1">
                  <StarOutlined />
                  <span>{project.stars}</span>
                </div>
              )}
              {project.forks !== undefined && (
                <div className="flex items-center gap-1">
                  <ForkOutlined />
                  <span>{project.forks}</span>
                </div>
              )}
              {project.createdAt && (
                <div className="flex items-center gap-1">
                  <CalendarOutlined />
                  <span>{new Date(project.createdAt).getFullYear()}</span>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3">
              <Button
                type="primary"
                icon={<LinkOutlined />}
                onClick={onPreview}
                className="flex-1 md:flex-none"
              >
                在线预览
              </Button>

              {project.githubUrl && (
                <Button
                  icon={<GithubOutlined />}
                  onClick={onGithub}
                  className="flex-1 md:flex-none"
                >
                  GitHub
                </Button>
              )}
            </div>

            {/* 项目备注 */}
            {project.remark && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 leading-relaxed">
                  {project.remark}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
