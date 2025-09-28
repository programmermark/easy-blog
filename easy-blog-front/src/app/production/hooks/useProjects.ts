import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { IProject, IProjectFilter, IProjectStats } from "../type";

// 模拟项目数据 - 实际项目中可以从API获取
const mockProjects: IProject[] = [
  {
    id: 1,
    name: "仿网易云音乐播放器",
    type: "开源项目",
    summary: "基于Vue3、Typescript和vite开发的仿网易云音乐客户端web版本。UI参照了网易云音乐mac客户端，后端接口由开源项目提供，高度还原了网易云音乐。项目仍在持续维护中...",
    coverUrl: "https://image.immortalboy.cn/public/uploads/2021/12/24/1640340786327969.jpg",
    githubUrl: "https://github.com/programmerMark/web-music-player",
    previewUrl: "https://music-player.immortalboy.cn",
    remark: "项目前端通过netlify自动部署，国内访问相对慢。",
    technologies: ["Vue3", "TypeScript", "Vite", "Element Plus"],
    status: "active",
    stars: 128,
    forks: 23,
    createdAt: "2021-12-01",
    tags: ["音乐", "Vue3", "TypeScript"]
  },
  {
    id: 2,
    name: "个人博客项目：easyblog第二版",
    type: "持续迭代中",
    summary: "个人博客的第二版，仍在持续迭代中。目前项目的仍使用旧版，计划后端重写，小程序重写，计划支持多人使用.开发完成后再开源。",
    coverUrl: "https://image.immortalboy.cn/public/uploads/2021/10/10/1633865388480575.png",
    githubUrl: "",
    previewUrl: "https://immortalboy.cn/",
    remark: "项目持续迭代中，同时个人博客积极更新中。",
    technologies: ["Next.js", "React", "TypeScript", "Prisma"],
    status: "active",
    stars: 0,
    forks: 0,
    createdAt: "2021-10-01",
    tags: ["博客", "Next.js", "全栈"]
  },
  {
    id: 3,
    name: "Mark天气",
    type: "开源项目",
    summary: "使用Taro3 + Vue3 + ts开发的天气小程序。项目提供了实时天气、城市天气搜索等功能。",
    coverUrl: "https://image.immortalboy.cn/public/uploads/2022/04/14/1649943754556143.jpg",
    githubUrl: "https://github.com/programmermark/markweather",
    previewUrl: "https://image.immortalboy.cn/public/uploads/2022/04/14/1649943640695640.jpg",
    remark: "项目持续迭代中。",
    technologies: ["Taro3", "Vue3", "TypeScript", "微信小程序"],
    status: "active",
    stars: 45,
    forks: 12,
    createdAt: "2022-04-01",
    tags: ["小程序", "天气", "Taro"]
  },
];

export interface UseProjectsReturn {
  projects: IProject[];
  filteredProjects: IProject[];
  loading: boolean;
  error: string | null;
  stats: IProjectStats;
  filter: IProjectFilter;
  fetchProjects: () => Promise<void>;
  setFilter: (filter: Partial<IProjectFilter>) => void;
  getProjectById: (id: number) => IProject | undefined;
  searchProjects: (keyword: string) => void;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<IProjectFilter>({
    type: "all",
    status: "all",
    keyword: ""
  });

  // 计算项目统计信息
  const stats: IProjectStats = {
    total: projects.length,
    openSource: projects.filter(p => p.type === "开源项目").length,
    active: projects.filter(p => p.status === "active").length,
    development: projects.filter(p => p.status === "development").length,
    completed: projects.filter(p => p.status === "completed").length,
    technologies: Array.from(new Set(projects.flatMap(p => p.technologies)))
      .map(tech => ({
        name: tech,
        count: projects.filter(p => p.technologies.includes(tech)).length
      }))
      .sort((a, b) => b.count - a.count)
  };

  // 获取项目列表
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProjects(mockProjects);
    } catch (err) {
      setError("加载项目失败，请稍后重试");
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 根据ID获取项目
  const getProjectById = useCallback((id: number) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  // 搜索项目
  const searchProjects = useCallback((keyword: string) => {
    setFilterState(prev => ({ ...prev, keyword }));
  }, []);

  // 设置筛选条件
  const setFilter = useCallback((newFilter: Partial<IProjectFilter>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
  }, []);

  // 应用筛选条件
  useEffect(() => {
    let filtered = projects;

    // 按类型筛选
    if (filter.type && filter.type !== "all") {
      filtered = filtered.filter(p => p.type === filter.type);
    }

    // 按状态筛选
    if (filter.status && filter.status !== "all") {
      filtered = filtered.filter(p => p.status === filter.status);
    }

    // 按技术栈筛选
    if (filter.technology) {
      filtered = filtered.filter(p =>
        p.technologies.some(tech =>
          tech.toLowerCase().includes(filter.technology!.toLowerCase())
        )
      );
    }

    // 按关键词搜索
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.summary.toLowerCase().includes(keyword) ||
        p.technologies.some(tech => tech.toLowerCase().includes(keyword)) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(keyword)))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, filter]);

  // 初始化
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    filteredProjects,
    loading,
    error,
    stats,
    filter,
    fetchProjects,
    setFilter,
    getProjectById,
    searchProjects
  };
}
