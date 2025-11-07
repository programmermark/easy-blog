"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { Button, Space, Divider, Spin } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  CodeOutlined,
  LinkOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  FileTextOutlined,
  UndoOutlined,
  RedoOutlined,
} from "@ant-design/icons";

interface PostEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function PostEditor({
  content,
  onChange,
  placeholder,
}: PostEditorProps) {
  const lowlight = createLowlight();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 禁用 StarterKit 中的 link 和 codeBlock，使用自定义版本
        link: false,
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Image,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 border border-gray-300 rounded-md",
      },
    },
    immediatelyRender: false, // 修复 SSR 水合不匹配问题
  });

  // 在客户端挂载之前显示加载状态
  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-md min-h-[300px] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const addLink = () => {
    const url = window.prompt("请输入链接地址");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="border-b border-gray-300 p-2">
        <Space wrap>
          <Button
            type={editor.isActive("bold") ? "primary" : "default"}
            icon={<BoldOutlined />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            size="small"
          />
          <Button
            type={editor.isActive("italic") ? "primary" : "default"}
            icon={<ItalicOutlined />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            size="small"
          />
          <Button
            type={editor.isActive("underline") ? "primary" : "default"}
            icon={<UnderlineOutlined />}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            size="small"
          />
          <Button
            type={editor.isActive("strike") ? "primary" : "default"}
            icon={<StrikethroughOutlined />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            size="small"
          />

          <Divider type="vertical" />

          <Button
            type={editor.isActive("code") ? "primary" : "default"}
            icon={<CodeOutlined />}
            onClick={() => editor.chain().focus().toggleCode().run()}
            size="small"
          />
          <Button icon={<LinkOutlined />} onClick={addLink} size="small" />
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            size="small"
          />
          <Button
            icon={<OrderedListOutlined />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            size="small"
          />
          <Button
            icon={<FileTextOutlined />}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            size="small"
          />

          <Divider type="vertical" />

          <Button
            icon={<UndoOutlined />}
            onClick={() => editor.chain().focus().undo().run()}
            size="small"
          />
          <Button
            icon={<RedoOutlined />}
            onClick={() => editor.chain().focus().redo().run()}
            size="small"
          />
        </Space>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[300px] p-4"
        placeholder={placeholder}
      />
    </div>
  );
}
