"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import likesApi from "@/api/likes";

interface LikeButtonProps {
  postId: string;
  initialLikeCount?: number;
  onLikeChange?: (liked: boolean, count: number) => void;
}

export default function LikeButton({
  postId,
  initialLikeCount = 0,
  onLikeChange,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  // 检查用户是否已点赞
  const checkLikeStatus = useCallback(async () => {
    try {
      const response = await likesApi.isLikedByUser(postId);
      setLiked(response.liked);
    } catch {
      // 如果用户未登录，忽略错误
      console.log("User not logged in");
    }
  }, [postId]);

  // 获取点赞数
  const fetchLikeCount = useCallback(async () => {
    try {
      const response = await likesApi.getPostLikeCount(postId);
      setLikeCount(response.count);
    } catch {
      console.error("Failed to fetch like count");
    }
  }, [postId]);

  // 切换点赞状态
  const handleToggleLike = async () => {
    setLoading(true);
    try {
      const response = await likesApi.toggleLike({ postId });
      setLiked(response.liked);
      setLikeCount((prev) => (response.liked ? prev + 1 : prev - 1));

      if (onLikeChange) {
        onLikeChange(
          response.liked,
          response.liked ? likeCount + 1 : likeCount - 1
        );
      }

      message.success(response.liked ? "点赞成功" : "取消点赞");
    } catch (error) {
      message.error("操作失败，请先登录");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLikeStatus();
    fetchLikeCount();
  }, [postId, checkLikeStatus, fetchLikeCount]);

  return (
    <Button
      type={liked ? "primary" : "default"}
      onClick={handleToggleLike}
      loading={loading}
      icon={liked ? <HeartFilled /> : <HeartOutlined />}
      className={`flex items-center space-x-1 ${
        liked
          ? "text-red-500 border-red-500 hover:border-red-600 hover:text-red-600"
          : "text-gray-600 hover:text-red-500 hover:border-red-500"
      }`}
    >
      <span>{likeCount}</span>
    </Button>
  );
}
