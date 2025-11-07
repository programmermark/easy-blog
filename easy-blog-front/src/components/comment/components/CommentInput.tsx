"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input, Button, Avatar, Upload, message } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { env } from "@/env";

const { TextArea } = Input;

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (comment: string, beCommentId?: string) => void;
  onShowLogin: () => void;
  isLoggedIn: boolean;
  userAvatar?: string;
  onAvatarChange: (avatar: string) => void;
  loading?: boolean;
  placeholder?: string;
  focus?: boolean;
}

export default function CommentInput({
  value,
  onChange,
  onSubmit,
  onShowLogin,
  isLoggedIn,
  userAvatar,
  onAvatarChange,
  loading = false,
  placeholder,
  focus = false,
}: CommentInputProps) {
  const [submitting, setSubmitting] = useState(false);
  const [isFocus, setIsFocus] = useState(focus);
  const [isMacOS, setIsMacOS] = useState(false);
  const textAreaRef = useRef<any>(null);

  // 检测操作系统
  useEffect(() => {
    const userAgent = navigator.userAgent;
    setIsMacOS(/Mac|iPhone|iPad|iPod/.test(userAgent));
  }, []);

  // 自动聚焦
  useEffect(() => {
    if (focus && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [focus]);

  const keyboardDesc = isMacOS ? "⌘ + Enter" : "Ctrl + Enter";

  const placeholderText =
    placeholder || `输入评论（Enter换行，${keyboardDesc}发送）`;

  // 是否展示操作按钮
  const displayOperate = value.length > 0 || isFocus;

  // 头像上传前验证
  const beforeAvatarUpload = (file: File) => {
    const isJPG = file.type === "image/jpeg";
    const isPNG = file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 1;

    if (!isJPG && !isPNG) {
      message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      return false;
    }
    if (!isLt2M) {
      message.error("上传头像图片大小不能超过 1MB!");
      return false;
    }
    return true;
  };

  // 头像上传成功
  const handleAvatarChange = (info: any) => {
    if (info.file.status === "done") {
      const res = info.file.response;
      if (res.success) {
        const avatarUrl = `${env.NEXT_PUBLIC_API_BASE_URL}${res.data.url}`;
        onAvatarChange(avatarUrl);
        message.success("头像上传成功");
      }
    } else if (info.file.status === "error") {
      message.error("头像上传失败");
    }
  };

  // 处理聚焦
  const handleFocus = () => {
    setIsFocus(true);
  };

  // 处理失焦
  const handleBlur = () => {
    if (!value.trim()) {
      setIsFocus(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 提交评论
  const handleSubmit = async () => {
    if (!value.trim()) {
      message.warning("请输入评论内容");
      return;
    }

    if (!isLoggedIn) {
      onShowLogin();
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(value.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex">
      {/* 用户头像 */}
      {!isLoggedIn ? (
        <Avatar
          size={40}
          icon={<UserOutlined />}
          className="cursor-pointer"
          onClick={onShowLogin}
        />
      ) : (
        <Upload
          name="file"
          action={env.NEXT_PUBLIC_UPLOAD_URL}
          beforeUpload={beforeAvatarUpload}
          onChange={handleAvatarChange}
          showUploadList={false}
        >
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt="用户头像"
              width={40}
              height={40}
              unoptimized
              sizes="40px"
              className="rounded-full border border-gray-400 box-border cursor-pointer"
            />
          ) : (
            <Avatar
              size={40}
              icon={<UserOutlined />}
              className="cursor-pointer"
            />
          )}
        </Upload>
      )}

      {/* 评论输入框 */}
      <div className="flex-1 ml-4">
        <div onClick={onShowLogin}>
          <TextArea
            ref={textAreaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={isLoggedIn ? placeholderText : "请先登录后发表评论"}
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{
              padding: "8px 12px",
              height: displayOperate ? "64px" : "auto",
              resize: "none",
            }}
            className="mb-3"
          />
        </div>

        {displayOperate && (
          <div className="flex mt-2">
            {/* 表情和图片按钮区域 */}
            <div className="flex-1"></div>

            {/* 评论按钮 */}
            <div className="flex-initial flex-shrink-0 ml-auto">
              <span className="mr-4 text-sm text-gray-400">{keyboardDesc}</span>
              <Button
                type="primary"
                size="middle"
                icon={<SendOutlined />}
                onClick={handleSubmit}
                loading={submitting || loading}
                disabled={!value.trim() || !isLoggedIn}
              >
                发表评论
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
