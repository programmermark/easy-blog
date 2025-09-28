"use client";

import { useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import Author from "@/components/author";
import ArticleCard from "@/components/article-card";
import { IArticle } from "@/components/article-card/type";
import postsApi from "@/api/posts";
import { transformBackendArticlesToCards } from "@/lib/utils/article";

export default function Home() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await postsApi.fetchPublishedPosts(currentPage, 10);
      const newArticles = transformBackendArticlesToCards(response.posts);

      if (currentPage === 1) {
        setArticles(newArticles);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
      }

      setCurrentPage((prev) => prev + 1);
      setHasMore(response.pagination.page < response.pagination.pages);
    } catch (err) {
      setError("加载文章失败，请稍后重试");
      console.error("Failed to load articles:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return (
    <div className="w-full h-full min-h-screen">
      <div className="max-w-5xl m-auto h-full">
        <div className="grid grid-cols-12 h-full pt-4 pb-8">
          {/* 文章列表  */}
          <div className="lg:col-span-9 md:col-span-12 min-h-0">
            {articles.length > 0 ? (
              <InfiniteScroll
                dataLength={articles.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <div className="text-center py-4">
                    <Spin size="default" />
                    <p className="mt-2 text-gray-500">加载更多文章...</p>
                  </div>
                }
                endMessage={
                  <div className="text-center py-4">
                    <p className="text-gray-400">没有更多文章了</p>
                  </div>
                }
              >
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </InfiniteScroll>
            ) : error ? (
              <div className="p-8 text-center bg-white rounded-lg shadow-sm">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => loadMore()}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  重试
                </button>
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-lg shadow-sm">
                <Spin size="default" />
                <p className="mt-2 text-gray-500">加载文章中...</p>
              </div>
            )}
          </div>
          {/* 个人信息  */}
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
