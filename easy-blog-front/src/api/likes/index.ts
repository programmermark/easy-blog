import { requestClient } from "@/lib/request-client";

export interface LikePostDto {
  postId: string;
}

export interface LikeResponse {
  liked: boolean;
}

export interface LikeCountResponse {
  count: number;
}

const likeApi = {
  /** 切换点赞状态 */
  toggleLike: (data: LikePostDto) =>
    requestClient.post<LikeResponse>("/likes/toggle", data),

  /** 点赞文章 */
  likePost: (data: LikePostDto) =>
    requestClient.post("/likes", data),

  /** 取消点赞 */
  unlikePost: (data: LikePostDto) =>
    requestClient.del(`/likes?postId=${data.postId}`),

  /** 获取文章点赞数 */
  getPostLikeCount: (postId: string) =>
    requestClient.get<LikeCountResponse>(`/likes/post/${postId}/count`),

  /** 检查用户是否已点赞 */
  isLikedByUser: (postId: string) =>
    requestClient.get<LikeResponse>(`/likes/post/${postId}/status`),
};

export default likeApi;
