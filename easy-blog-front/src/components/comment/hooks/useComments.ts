import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import commentsApi, { Comment, CreateCommentDto } from "@/api/comments";

export interface UseCommentsProps {
  postId: string;
}

export interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  submitting: boolean;
  fetchComments: () => Promise<void>;
  createComment: (content: string, visitorId?: string, parentId?: string) => Promise<void>;
  updateComment: (comment: Comment) => void;
}

export function useComments({ postId }: UseCommentsProps): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 获取评论列表
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await commentsApi.getCommentsByPostId(postId);
      setComments(response);
    } catch (error) {
      message.error("加载评论失败");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // 创建评论
  const createComment = useCallback(async (content: string, visitorId?: string, parentId?: string) => {
    setSubmitting(true);
    try {
      const commentData: CreateCommentDto = {
        content,
        postId,
        visitorId,
        parentId,
      };

      await commentsApi.createComment(commentData);
      message.success(parentId ? "回复发表成功" : "评论发表成功");
      await fetchComments(); // 重新加载评论
    } catch (error) {
      message.error("评论发表失败，请先登录");
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [postId, fetchComments]);

  // 更新评论
  const updateComment = useCallback((comment: Comment) => {
    setComments(prevComments =>
      prevComments.map(item =>
        item.id === comment.id ? comment : item
      )
    );
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    submitting,
    fetchComments,
    createComment,
    updateComment,
  };
}
