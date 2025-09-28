"use client";

import { useState } from "react";
import { Spin } from "antd";
import CommentInput from "./components/CommentInput";
import CommentItem from "./components/CommentItem";
import CommentModal from "./components/CommentModal";
import { useComments } from "./hooks/useComments";
import { useAuth } from "./hooks/useAuth";
import { Comment } from "@/api/comments";

interface CommentComponentProps {
  postId: string;
}

// 扁平化多级回复为二级回复
const flattenReplies = (replies: Comment[]): Comment[] => {
  const result: Comment[] = [];

  const flatten = (replyList: Comment[]) => {
    replyList.forEach((reply) => {
      result.push(reply);
      if (reply.replies && reply.replies.length > 0) {
        flatten(reply.replies);
      }
    });
  };

  flatten(replies);
  return result;
};

// 获取原始父评论（顶级评论）
const getOriginalParent = (
  reply: Comment,
  topLevelComment: Comment
): Comment => {
  // 如果回复直接属于顶级评论，返回顶级评论
  if (reply.parentId === topLevelComment.id) {
    return topLevelComment;
  }

  // 否则，递归查找原始父评论
  const findOriginalParent = (
    comments: Comment[],
    targetId: string
  ): Comment | null => {
    for (const comment of comments) {
      if (comment.id === targetId) {
        return comment;
      }
      if (comment.replies && comment.replies.length > 0) {
        const found = findOriginalParent(comment.replies, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  // 查找回复的直接父评论
  const directParent = findOriginalParent(
    topLevelComment.replies || [],
    reply.parentId || ""
  );
  if (directParent) {
    return topLevelComment; // 返回顶级评论作为显示父评论
  }

  return topLevelComment; // 默认返回顶级评论
};

export default function CommentComponent({ postId }: CommentComponentProps) {
  const [newComment, setNewComment] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 使用自定义hooks
  const { comments, loading, submitting, createComment, updateComment } =
    useComments({ postId });
  const { isLoggedIn, userAvatar, visitor, updateAvatar, updateVisitor } =
    useAuth();

  // 显示登录对话框
  const handleShowLoginDialog = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
  };

  // 登录成功回调
  const handleLoginSuccess = (visitorData: any) => {
    // 更新访客状态
    updateVisitor(visitorData);
  };

  // 提交评论
  const handleSubmitComment = async (comment: string, beCommentId?: string) => {
    try {
      if (beCommentId) {
        // 回复评论 - 需要传递parentId
        await createComment(comment, visitor?.id, beCommentId);
      } else {
        // 发表新评论
        await createComment(comment, visitor?.id);
        setNewComment("");
      }
    } catch (error) {
      // 错误已在hook中处理
    }
  };

  return (
    <div className="px-8 pb-6 mt-4 bg-white">
      {/* 发表评论 */}
      <div className="pt-6">
        {/* 标题 */}
        <div className="text-lg text-gray-800 font-semibold mb-6">评论</div>

        {/* 发表评论输入框 */}
        <CommentInput
          value={newComment}
          onChange={setNewComment}
          onSubmit={handleSubmitComment}
          onShowLogin={handleShowLoginDialog}
          isLoggedIn={isLoggedIn}
          userAvatar={userAvatar}
          onAvatarChange={updateAvatar}
          loading={submitting}
        />
      </div>

      {/* 全部评论 */}
      {comments && comments.length > 0 && (
        <div className="pt-8">
          <div className="text-lg text-gray-800 font-semibold py-2">
            全部评论 ({comments.length})
          </div>
          <div>
            {loading ? (
              <div className="text-center py-8">
                <Spin size="default" />
                <p className="mt-2 text-gray-500">加载评论中...</p>
              </div>
            ) : (
              <div>
                {comments.map((comment) => (
                  <div key={comment.id}>
                    <CommentItem
                      comment={comment}
                      onUpdateComment={updateComment}
                      onReFetchComment={() => {
                        // 重新获取评论
                        window.location.reload();
                      }}
                      onShowDialog={handleShowLoginDialog}
                      onSubmit={handleSubmitComment}
                      isLoggedIn={isLoggedIn}
                      userAvatar={userAvatar}
                      onAvatarChange={updateAvatar}
                    />
                    {/* 回复 - 扁平化显示所有多级回复 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-12 mt-4 pl-4 border-l-2 border-gray-200">
                        {flattenReplies(comment.replies).map((reply) => (
                          <CommentItem
                            key={reply.id}
                            comment={reply}
                            isChildren={true}
                            parentComment={getOriginalParent(reply, comment)}
                            onUpdateComment={updateComment}
                            onReFetchComment={() => {
                              // 重新获取评论
                              window.location.reload();
                            }}
                            onShowDialog={handleShowLoginDialog}
                            onSubmit={handleSubmitComment}
                            isLoggedIn={isLoggedIn}
                            userAvatar={userAvatar}
                            onAvatarChange={updateAvatar}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 登录模态框 */}
      <CommentModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
