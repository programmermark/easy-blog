/**
 * 项目状态枚举
 */
export type ProjectStatus = "active" | "development" | "completed" | "archived";

/**
 * 项目类型枚举
 */
export type ProjectType = "开源项目" | "持续迭代中" | "商业项目" | "学习项目";

/**
 * 项目接口定义
 */
export interface IProject {
  /** 项目ID */
  id: number;
  /** 项目名称 */
  name: string;
  /** 项目类型 */
  type: ProjectType;
  /** 项目描述 */
  summary: string;
  /** 项目封面图URL */
  coverUrl: string;
  /** GitHub仓库地址 */
  githubUrl: string;
  /** 在线预览地址 */
  previewUrl: string;
  /** 项目备注 */
  remark: string;
  /** 技术栈 */
  technologies: string[];
  /** 项目状态 */
  status: ProjectStatus;
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
  /** 项目标签 */
  tags?: string[];
  /** 项目星级 */
  stars?: number;
  /** 项目forks数 */
  forks?: number;
}

/**
 * 项目筛选条件
 */
export interface IProjectFilter {
  /** 项目类型 */
  type?: ProjectType | "all";
  /** 项目状态 */
  status?: ProjectStatus | "all";
  /** 技术栈 */
  technology?: string;
  /** 搜索关键词 */
  keyword?: string;
}

/**
 * 项目统计信息
 */
export interface IProjectStats {
  /** 总项目数 */
  total: number;
  /** 开源项目数 */
  openSource: number;
  /** 活跃项目数 */
  active: number;
  /** 开发中项目数 */
  development: number;
  /** 已完成项目数 */
  completed: number;
  /** 技术栈分布 */
  technologies: Array<{
    name: string;
    count: number;
  }>;
}
