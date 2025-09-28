export interface UserInfo {
  id: string;
  nickname: string;
  wechat: string;
  phone: string;
  email: string;
  github: string;
  avatarBase64: string;
  backgroundImage?: string;
  updatedAt: string;
  // 统计信息（可以从其他接口获取）
  articleCount?: number;
  viewCount?: number;
}
