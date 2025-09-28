"use client";

import { useState } from "react";
import { Button, Card, Tag, message, Input } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import Author from "@/components/author";
import { ProjectCard } from "./components";
import { useProjects } from "./hooks";

const { Search } = Input;

export default function ProductionPage() {
  const [searchKeyword, setSearchKeyword] = useState("");

  const {
    projects,
    filteredProjects,
    loading,
    error,
    stats,
    filter,
    fetchProjects,
    setFilter,
    searchProjects,
  } = useProjects();

  // 获取所有项目类型
  const projectTypes = Array.from(new Set(projects.map((p) => p.type)));

  const handlePreview = (project: any) => {
    if (project.previewUrl === "#") {
      message.info("项目预览链接暂未开放");
      return;
    }
    window.open(project.previewUrl, "_blank");
  };

  const handleGithub = (project: any) => {
    if (!project.githubUrl || project.githubUrl === "#") {
      message.info("项目源码暂未开放");
      return;
    }
    window.open(project.githubUrl, "_blank");
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    searchProjects(value);
  };

  const handleTypeChange = (type: string) => {
    setFilter({ type: type as any });
  };

  return (
    <div className="w-full h-full min-h-screen bg-gray-50">
      <div className="max-w-6xl m-auto h-full pt-4 pb-8">
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧内容 */}
          <div className="lg:col-span-9 md:col-span-12">
            {/* 页面标题和筛选 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  我的作品集
                </h1>
                <p className="text-gray-600">
                  展示我在前端开发、全栈开发等方面的项目作品
                </p>
              </div>

              {/* 搜索和筛选 */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Search
                    placeholder="搜索项目名称、描述或技术栈..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    onSearch={handleSearch}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>

                {/* 项目类型筛选 */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type={filter.type === "all" ? "primary" : "default"}
                    size="large"
                    onClick={() => handleTypeChange("all")}
                  >
                    全部 ({projects.length})
                  </Button>
                  {projectTypes.map((type) => (
                    <Button
                      key={type}
                      type={filter.type === type ? "primary" : "default"}
                      size="large"
                      onClick={() => handleTypeChange(type)}
                    >
                      {type} ({projects.filter((p) => p.type === type).length})
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 项目列表 */}
            <div className="space-y-6">
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">加载项目中...</p>
                </div>
              ) : error ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={fetchProjects}>重新加载</Button>
                </div>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onPreview={() => handlePreview(project)}
                    onGithub={() => handleGithub(project)}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <EyeOutlined className="text-4xl text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    {searchKeyword ? "没有找到相关项目" : "暂无该类型的项目"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="lg:col-span-3 md:col-span-12">
            <div className="sticky top-20">
              <Author />

              {/* 项目统计 */}
              <Card className="mt-6" title="项目统计">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">总项目数</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">开源项目</span>
                    <span className="font-medium">{stats.openSource}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">活跃项目</span>
                    <span className="font-medium">{stats.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">开发中</span>
                    <span className="font-medium">{stats.development}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">已完成</span>
                    <span className="font-medium">{stats.completed}</span>
                  </div>
                </div>
              </Card>

              {/* 技术栈 */}
              <Card className="mt-6" title="主要技术栈">
                <div className="flex flex-wrap gap-2">
                  {stats.technologies.slice(0, 10).map((tech) => (
                    <Tag key={tech.name} color="blue">
                      {tech.name} ({tech.count})
                    </Tag>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
