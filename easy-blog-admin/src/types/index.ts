export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImage?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryIds?: string[]; // 用于表单提交
  tagIds?: string[]; // 用于表单提交
  categories?: Category[]; // 后端返回的分类对象数组
  tags?: Tag[]; // 后端返回的标签对象数组
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  posts?: Post[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Category 相关的 DTO 类型
export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
}

export interface CategoryWithPostCount extends Category {
  _count?: {
    posts: number;
  };
}

// Tag 相关的 DTO 类型
export interface CreateTagDto {
  name: string;
  slug: string;
  color?: string;
}

export interface UpdateTagDto {
  name?: string;
  slug?: string;
  color?: string;
}

export interface TagWithPostCount extends Tag {
  _count?: {
    posts: number;
  };
}
