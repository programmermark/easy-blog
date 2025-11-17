"use client";

import { Modal, Input, Button, message, Space, Spin } from "antd";
import { SendOutlined, ReloadOutlined, StopOutlined } from "@ant-design/icons";
import { useState } from "react";
import aiWritingApi from "@/api/ai-writing";
import { getErrorMessage, isRetryable } from "@/utils/error-handler";

interface AIWritingPanelProps {
  visible: boolean;
  onClose: () => void;
  onInsert: (content: string) => void;
}

export default function AIWritingPanel({
  visible,
  onClose,
  onInsert,
}: AIWritingPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [cancelled, setCancelled] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      message.warning("请输入写作提示");
      return;
    }

    setCancelled(false);
    setLoading(true);
    setGeneratedContent("");
    try {
      const content = await aiWritingApi.generateContent({
        prompt,
        context: context || undefined,
      });
      if (!cancelled) {
        setGeneratedContent(content);
      }
    } catch (error: any) {
      if (!cancelled) {
        const errorMsg = getErrorMessage(error);
        const retryable = isRetryable(error);
        message.error({
          content: errorMsg,
          duration: retryable ? 5 : 3,
        });
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setCancelled(true);
    setLoading(false);
    message.info("已取消生成");
  };

  const handleInsert = () => {
    if (generatedContent) {
      onInsert(generatedContent);
      setPrompt("");
      setContext("");
      setGeneratedContent("");
      onClose();
    }
  };

  const handleRegenerate = () => {
    setGeneratedContent("");
    handleGenerate();
  };

  const handleClose = () => {
    setPrompt("");
    setContext("");
    setGeneratedContent("");
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">✨ AI 智能写作</span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      width={800}
      footer={null}
      destroyOnHidden
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            写作提示 <span className="text-red-500">*</span>
          </label>
          <Input.TextArea
            rows={4}
            placeholder="例如：写一篇关于NestJS框架的技术文章，包括其特点、优势和使用场景"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            上下文信息（可选）
          </label>
          <Input.TextArea
            rows={2}
            placeholder="例如：目标读者是中级开发者，文章风格要专业但易懂"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            disabled={loading}
          />
        </div>

        <Space.Compact block size="large">
          <Button
            type="primary"
            icon={loading ? <StopOutlined /> : <SendOutlined />}
            onClick={loading ? handleCancel : handleGenerate}
            loading={loading && !cancelled}
            block
            size="large"
            danger={loading}
          >
            {loading ? "取消生成" : "生成内容"}
          </Button>
        </Space.Compact>

        {loading && (
          <div className="text-center py-8">
            <Spin size="large" />
            <p className="mt-4 text-gray-500">AI正在生成内容，请稍候...</p>
            <p className="mt-2 text-xs text-gray-400">
              这可能需要几秒钟到几分钟，取决于内容长度
            </p>
          </div>
        )}

        {generatedContent && !loading && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-medium text-gray-700">
                生成的内容
              </label>
              <Button
                type="link"
                icon={<ReloadOutlined />}
                onClick={handleRegenerate}
                size="small"
              >
                重新生成
              </Button>
            </div>
            <div
              className="border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto prose prose-sm"
              dangerouslySetInnerHTML={{ __html: generatedContent }}
              style={{ wordBreak: "break-word" }}
            />
            <Space className="mt-4" style={{ width: "100%" }}>
              <Button type="primary" onClick={handleInsert} block>
                插入到编辑器
              </Button>
            </Space>
          </div>
        )}
      </div>
    </Modal>
  );
}
