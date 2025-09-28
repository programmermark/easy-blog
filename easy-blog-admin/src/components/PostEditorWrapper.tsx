"use client";

import dynamic from "next/dynamic";
import { Spin } from "antd";

// 动态导入 PostEditor，禁用 SSR
const PostEditor = dynamic(() => import("./PostEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-md min-h-[300px] flex items-center justify-center">
      <Spin size="large" />
    </div>
  ),
});

interface PostEditorWrapperProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function PostEditorWrapper(props: PostEditorWrapperProps) {
  return <PostEditor {...props} />;
}
