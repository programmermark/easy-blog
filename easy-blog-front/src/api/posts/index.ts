import { requestClient } from "@/lib/request-client";
import { ArticlesResponse, BackendArticle } from "@/components/article-card/type";

const postApi = {
  /** 获取已发布的文章列表 */
  fetchPublishedPosts: (page: number = 1, limit: number = 10) =>
    requestClient.get<ArticlesResponse>(`/posts/published?page=${page}&limit=${limit}`),

  /** 获取文章详情 */
  fetchPostById: (id: string) =>
    requestClient.get<BackendArticle>(`/posts/${id}`),

  /** 根据slug获取文章 */
  fetchPostBySlug: (slug: string) =>
    requestClient.get<BackendArticle>(`/posts/slug/${slug}`),
};

export default postApi;
