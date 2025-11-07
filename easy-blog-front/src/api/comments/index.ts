import { requestClient } from "@/lib/request-client";

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId?: string;
  visitorId?: string;
  parentId?: string;
  isApproved: boolean;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  visitor?: {
    id: string;
    nickname: string;
    avatarUrl?: string;
    site?: string;
  };
  replies?: Comment[];
}

export interface CreateCommentDto {
  content: string;
  postId: string;
  parentId?: string;
  visitorId?: string;
}

const commentApi = {
  /** 获取文章评论 */
  getCommentsByPostId: (postId: string) =>
    requestClient.get<Comment[]>(`/comments/post/${postId}`),

  /** 创建评论 */
  createComment: (data: CreateCommentDto) =>
    requestClient.post<Comment>("/comments", data),

  /** 删除评论 */
  deleteComment: (commentId: string) =>
    requestClient.del(`/comments/${commentId}`),
};

export default commentApi;
