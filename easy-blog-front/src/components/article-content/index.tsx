"use client";

import { useMemo } from "react";
import Image from "next/image";
import { BackendArticle } from "@/components/article-card/type";
import { formatDateToText } from "@/lib/utils/date";
import { env } from "@/env";
import "./article-content.css";

interface ArticleContentProps {
  article: BackendArticle;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  // 格式化文章内容为HTML
  const articleContent = useMemo(() => {
    // 简单的Markdown转HTML处理
    // 在实际项目中，你可能需要使用更强大的Markdown解析器如marked或remark
    return article.content
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>");
  }, [article.content]);

  return (
    <div className="px-6">
      <div className="pt-6">
        {/* 文章简略信息：作者、发布时间 */}
        <div className="mb-1 text-base font-medium text-gray-700">
          {article.author.name}
        </div>
        <div className="mb-6 text-sm text-gray-500">
          <span>
            {formatDateToText(article.publishedAt || article.createdAt)}
          </span>
          <span className="ml-2">
            阅读 <span>{article.readCount}</span>
          </span>
        </div>

        {/* 文章封面图片 */}
        {article.coverImage && (
          <div className="w-full mb-5">
            <Image
              src={
                article.coverImage.startsWith("http")
                  ? article.coverImage
                  : `${env.NEXT_PUBLIC_API_BASE_URL}${article.coverImage}`
              }
              alt="文章配图"
              width={800}
              height={400}
              className="w-full h-auto rounded"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* 文章标题 */}
        <div className="mb-5 text-3xl font-semibold text-gray-800">
          {article.title}
        </div>
      </div>

      {/* 文章内容 */}
      <div
        className="article-content text-[15px] text-gray-800 border-b border-gray-200"
        dangerouslySetInnerHTML={{ __html: articleContent }}
      />
    </div>
  );
}
