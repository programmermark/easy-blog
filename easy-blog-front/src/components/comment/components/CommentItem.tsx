"use client";

import { useState } from "react";
import Image from "next/image";
import { UserOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Comment } from "@/api/comments";
import CommentInput from "./CommentInput";

interface CommentItemProps {
  comment: Comment;
  isChildren?: boolean;
  parentComment?: Comment;
  onUpdateComment?: (comment: Comment) => void;
  onReFetchComment?: () => void;
  onShowDialog?: () => void;
  onSubmit?: (comment: string, beCommentId?: string) => void;
  isLoggedIn?: boolean;
  userAvatar?: string;
  onAvatarChange?: (avatar: string) => void;
}

export default function CommentItem({
  comment,
  isChildren = false,
  parentComment,
  onUpdateComment,
  onReFetchComment,
  onShowDialog,
  onSubmit,
  isLoggedIn = false,
  userAvatar,
  onAvatarChange,
}: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const avatarSrc =
    comment.author?.avatarUrl ||
    comment.visitor?.avatarUrl ||
    "/default-avatar.png";
  const avatarAlt =
    comment.author?.name || comment.visitor?.nickname || "用户";
  const avatarSize = isChildren ? 24 : 40;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString();
  };

  // 处理点赞
  const handleLike = () => {
    if (!isLoggedIn) {
      onShowDialog?.();
      return;
    }

    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    // 这里应该调用API
  };

  // 处理回复按钮
  const handleReply = () => {
    if (!isLoggedIn) {
      onShowDialog?.();
      return;
    }

    setShowReplyInput(!showReplyInput);
  };

  // 处理回复提交
  const handleReplySubmit = (reply: string) => {
    if (reply.trim()) {
      onSubmit?.(reply, comment.id);
      setReplyValue("");
      setShowReplyInput(false);
    }
  };

  return (
    <div className={`flex ${isChildren ? "py-0 pt-6" : "py-4"}`}>
      {/* 头像 */}
      <Image
        className={`rounded-full border border-gray-400 ${
          isChildren ? "w-6 h-6" : "w-10 h-10"
        }`}
        src={avatarSrc}
        alt={avatarAlt}
        width={avatarSize}
        height={avatarSize}
        unoptimized
        sizes={`${avatarSize}px`}
      />

      <div className="flex-1 ml-4">
        {/* 评论内容 */}
        <div>
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="text-[15px] text-gray-800 font-medium">
                {comment.author?.name || comment.visitor?.nickname}
              </div>
              {/* 存在父级评论时 */}
              {parentComment && (
                <div className="flex items-center ml-2">
                  <span className="text-gray-500 text-sm">回复</span>
                  <span className="text-[15px] text-blue-600 font-medium ml-1">
                    {parentComment.author?.name ||
                      parentComment.visitor?.nickname}
                  </span>
                </div>
              )}
            </div>
            <span className="ml-auto text-sm text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          <div
            className="my-2 text-sm text-gray-700 break-all"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />

          {/* 父级评论引用 */}
          {parentComment && (
            <div className="mt-2 mb-3 px-3 py-1 bg-gray-100 border-gray-200 border rounded">
              <div
                className="text-sm text-gray-500 break-all"
                dangerouslySetInnerHTML={{
                  __html: `"${parentComment.content}"`,
                }}
              />
            </div>
          )}
        </div>

        {/* 评论操作：点赞和回复 */}
        <div className="flex items-center">
          <div
            className={`flex items-center text-sm cursor-pointer mr-4 hover:text-blue-500 ${
              liked ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={handleLike}
          >
            <LikeOutlined className="text-base" />
            <span className="ml-1">{likeCount > 0 ? likeCount : "点赞"}</span>
          </div>

          <div
            className={`flex items-center text-sm cursor-pointer hover:text-blue-500 ${
              showReplyInput ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={handleReply}
          >
            <MessageOutlined className="text-base" />
            <span className="ml-1">{showReplyInput ? "取消回复" : "回复"}</span>
          </div>
        </div>

        {/* 回复输入框 */}
        {showReplyInput && (
          <div className={`mt-3 ${isChildren ? "mb-0" : "mb-6"}`}>
            <CommentInput
              value={replyValue}
              onChange={setReplyValue}
              onSubmit={handleReplySubmit}
              onShowLogin={onShowDialog || (() => {})}
              isLoggedIn={isLoggedIn}
              userAvatar={userAvatar}
              onAvatarChange={onAvatarChange || (() => {})}
              placeholder={`回复 ${
                comment.author?.name || comment.visitor?.nickname
              }...`}
              focus={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
