import { BackendArticle, IArticle } from "@/components/article-card/type";

/**
 * 将后端文章数据转换为前端文章卡片数据
 */
export function transformBackendArticleToCard(backendArticle: BackendArticle): IArticle {
  return {
    id: backendArticle.id,
    authorName: backendArticle.author.name,
    publishTime: backendArticle.publishedAt || backendArticle.createdAt,
    type: backendArticle.categories[0]?.name || "未分类",
    title: backendArticle.title,
    introduce: backendArticle.summary || backendArticle.content.substring(0, 100) + "...",
    introduceImg: backendArticle.coverImage || undefined,
    viewCount: backendArticle.readCount,
    likeCount: backendArticle._count?.likes || 0,
    commentCount: backendArticle._count?.comments || 0,
  };
}

/**
 * 将后端文章列表转换为前端文章卡片列表
 */
export function transformBackendArticlesToCards(backendArticles: BackendArticle[]): IArticle[] {
  return backendArticles.map(transformBackendArticleToCard);
}
