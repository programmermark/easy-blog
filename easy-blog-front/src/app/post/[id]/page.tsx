"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Spin, message } from "antd";
import Author from "@/components/author";
import ArticleContent from "@/components/article-content";
import CommentComponent from "@/components/comment";
import LikeButton from "@/components/like-button";
import { BackendArticle } from "@/components/article-card/type";
import postsApi from "@/api/posts";

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params.id as string;
  const [article, setArticle] = useState<BackendArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      if (!articleId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await postsApi.fetchPostById(articleId);
        setArticle(response);
      } catch (err) {
        setError("加载文章失败，请稍后重试");
        message.error("加载文章详情失败");
        console.error("Failed to load article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [articleId]);

  if (loading) {
    return (
      <div className="w-full h-full min-h-screen">
        <div className="max-w-5xl m-auto h-full">
          <div className="grid grid-cols-12 h-full pt-4 pb-8">
            <div className="lg:col-span-9 md:col-span-12 min-h-0">
              <div className="p-8 text-center bg-white rounded-lg shadow-sm">
                <Spin size="large" />
                <p className="mt-4 text-gray-500">加载文章中...</p>
              </div>
            </div>
            <div className="right-0 col-span-3 ml-5 rounded">
              <div className="fixed w-[236px]">
                <Author />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="w-full h-full min-h-screen">
        <div className="max-w-5xl m-auto h-full">
          <div className="grid grid-cols-12 h-full pt-4 pb-8">
            <div className="lg:col-span-9 md:col-span-12 min-h-0">
              <div className="p-8 text-center bg-white rounded-lg shadow-sm">
                <p className="text-red-500">{error || "文章不存在"}</p>
              </div>
            </div>
            <div className="right-0 col-span-3 ml-5 rounded">
              <div className="fixed w-[236px]">
                <Author />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen">
      <div className="max-w-5xl m-auto h-full">
        <div className="grid grid-cols-12 h-full pt-4 pb-8">
          {/* 文章内容 */}
          <div className="pb-4 rounded shadow-sm lg:col-span-9 md:col-span-12">
            <div className="bg-white mb-4">
              <ArticleContent article={article} />
            </div>

            {/* 点赞按钮 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <LikeButton
                    postId={article.id}
                    initialLikeCount={article._count?.likes || 0}
                  />
                  <div className="text-sm text-gray-500">
                    {article.readCount} 次阅读
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {article._count?.comments || 0} 条评论
                </div>
              </div>
            </div>

            {/* 文章评论 */}
            <CommentComponent postId={article.id} />
          </div>
          {/* 个人信息 */}
          <div className="right-0 col-span-3 ml-5 rounded">
            <div className="fixed w-[236px]">
              <Author />
              {/* <Footer /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
