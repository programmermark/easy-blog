// 后端文章数据结构
export interface BackendArticle {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  coverImage: string | null;
  status: string;
  isPinned: boolean;
  publishedAt: string | null;
  authorId: string;
  readCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
  }>;
  _count: {
    comments: number;
    likes: number;
  };
}

// 前端文章卡片数据结构
export interface IArticle {
  id: string | number;
  authorName: string;
  publishTime: string;
  type: string;
  title: string;
  introduce: string;
  introduceImg?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

// 后端API响应结构
export interface ArticlesResponse {
  posts: BackendArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
