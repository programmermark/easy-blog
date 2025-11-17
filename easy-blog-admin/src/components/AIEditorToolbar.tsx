"use client";

import { Button, Space, message, Tooltip } from "antd";
import {
  RobotOutlined,
  ThunderboltOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import aiWritingApi from "@/api/ai-writing";
import { getErrorMessage, isRetryable } from "@/utils/error-handler";

interface AIEditorToolbarProps {
  editor: Editor;
  onOpenWritingPanel?: () => void;
}

export default function AIEditorToolbar({
  editor,
  onOpenWritingPanel,
}: AIEditorToolbarProps) {
  const [loading, setLoading] = useState<string | null>(null);

  // AI生成内容
  const handleGenerate = () => {
    if (onOpenWritingPanel) {
      onOpenWritingPanel();
    }
  };

  // 优化选中内容
  const handleOptimize = async () => {
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
    );

    if (!selectedText || selectedText.trim().length === 0) {
      message.warning("请先选中要优化的文本");
      return;
    }

    setLoading("optimize");
    try {
      const optimized = await aiWritingApi.optimizeContent({
        content: selectedText,
      });
      // 如果返回的是纯文本，包装成段落；如果已经是HTML，直接使用
      const contentToInsert = optimized.trim().startsWith('<') 
        ? optimized 
        : `<p>${optimized}</p>`;
      editor
        .chain()
        .focus()
        .deleteSelection()
        .insertContent(contentToInsert)
        .run();
      message.success("内容优化完成");
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      const retryable = isRetryable(error);
      message.error({
        content: errorMsg,
        duration: retryable ? 5 : 3,
      });
    } finally {
      setLoading(null);
    }
  };

  // 续写
  const handleContinue = async () => {
    const currentContent = editor.getHTML();
    if (!currentContent || currentContent.trim().length === 0) {
      message.warning("请先输入一些内容");
      return;
    }

    setLoading("continue");
    try {
      const response = await aiWritingApi.continueWriting({
        content: currentContent,
      });
      editor.chain().focus().insertContent(`<p>${response}</p>`).run();
      message.success("续写完成");
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      const retryable = isRetryable(error);
      message.error({
        content: errorMsg,
        duration: retryable ? 5 : 3,
      });
    } finally {
      setLoading(null);
    }
  };

  const hasSelection = !editor.state.selection.empty;

  return (
    <Space>
      <Tooltip title="使用AI生成文章内容">
        <Button
          type="default"
          icon={<RobotOutlined />}
          onClick={handleGenerate}
          size="small"
          className="text-blue-600 border-blue-300 hover:border-blue-500 hover:bg-blue-50"
        >
          AI写作
        </Button>
      </Tooltip>
      <Tooltip title={hasSelection ? "优化选中的文本内容" : "请先选中要优化的文本"}>
        <Button
          type="default"
          icon={<EditOutlined />}
          onClick={handleOptimize}
          disabled={!hasSelection}
          loading={loading === "optimize"}
          size="small"
          className="text-green-600 border-green-300 hover:border-green-500 hover:bg-green-50"
        >
          优化
        </Button>
      </Tooltip>
      <Tooltip title="基于当前内容智能续写下一段">
        <Button
          type="default"
          icon={<ThunderboltOutlined />}
          onClick={handleContinue}
          loading={loading === "continue"}
          size="small"
          className="text-purple-600 border-purple-300 hover:border-purple-500 hover:bg-purple-50"
        >
          续写
        </Button>
      </Tooltip>
    </Space>
  );
}

