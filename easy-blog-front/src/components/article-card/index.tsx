"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IArticle } from "./type";
import { formatDateToText } from "@/lib/utils/date";
import { env } from "@/env";

interface ArticleCardProps {
  article: IArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const router = useRouter();

  const gotoArticleDetailPage = (id: string | number) => {
    router.push(`/post/${id}`);
  };

  return (
    <div
      className="pt-4 pb-2 px-4 mx-4 mb-4 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={() => gotoArticleDetailPage(article.id)}
    >
      {/* 简略信息 */}
      <div className="flex items-center text-[13px] text-gray-400">
        <div className="pr-3 text-gray-600 border-r border-gray-200 cursor-pointer hover:text-gray-800 transition-colors">
          {article.authorName}
        </div>
        <div className="px-3 border-r border-gray-200 cursor-pointer hover:text-gray-600 transition-colors">
          {formatDateToText(article.publishTime)}
        </div>
        <div className="pl-3 cursor-pointer hover:text-gray-600 transition-colors">
          {article.type}
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 mt-2 mr-9 w-[calc(100%-164px)]">
          {/* 文章标题 */}
          <div className="mb-2 text-base font-semibold text-gray-800 cursor-pointer hover:text-gray-900 transition-colors line-clamp-2">
            {article.title}
          </div>
          {/* 文章简介 */}
          <div
            className="mb-2 text-[13px] w-full text-gray-400 text-ellipsis cursor-pointer hover:text-gray-500 transition-colors line-clamp-2"
            dangerouslySetInnerHTML={{ __html: article.introduce }}
          />
          {/* 统计信息 */}
          <div className="flex items-center space-x-4">
            <div className="text-[13px] text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
              <span className="text-sm iconfont icon-view-count">👁</span>
              <span className="ml-1">{article.viewCount}</span>
            </div>
            <div className="text-[13px] text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
              <span className="text-sm iconfont icon-like-count">❤️</span>
              <span className="ml-1">{article.likeCount}</span>
            </div>
            <div className="text-[13px] text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
              <span className="text-sm iconfont icon-comment-count">💬</span>
              <span className="ml-1">{article.commentCount}</span>
            </div>
          </div>
        </div>
        {/* 文章配图 */}
        {article.introduceImg && (
          <div className="box-border w-32 h-20 border border-gray-200 rounded overflow-hidden flex-shrink-0">
            <Image
              src={
                article.introduceImg.startsWith("http")
                  ? article.introduceImg
                  : `${env.NEXT_PUBLIC_API_BASE_URL}${article.introduceImg}`
              }
              alt={article.title}
              width={128}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
