"use client";

import Link from "next/link";
import Image from "next/image";
import Author from "@/components/author";

// 工具数据
const tools = [
  {
    name: "文章封面生成器",
    type: "可用",
    summary:
      "用于生成文章的配图，基本模板目前只有一个，可以切换封面的配图和文字。",
    coverUrl:
      "https://immortalboy.cn/public/uploads/2021/10/15/163430004443281.jpg",
    previewUrl: "/tools/cover-designer",
    remark: "目前只有一个模板，有好的UI会再增加模板",
  },
];

export default function ToolsPage() {
  return (
    <div className="w-full bg-gray-100">
      <div className="max-w-5xl m-auto">
        <div className="grid grid-cols-12 mt-4 mb-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-9 md:col-span-12">
            {tools.map((tool, index) => (
              <div
                key={tool.name}
                className="flex px-4 py-3 mb-5 bg-white border border-gray-200 rounded shadow"
              >
                {/* 工具封面图片 */}
                <div className="mr-4 bg-gray-900 border border-gray-100 rounded-lg relative h-48 w-80">
                  <Image
                    src={tool.coverUrl}
                    alt="工具预览图片"
                    fill
                    unoptimized
                    sizes="20rem"
                    className="object-contain p-4"
                  />
                </div>

                {/* 工具信息 */}
                <div className="flex-1">
                  {/* 工具名称 */}
                  <Link
                    className="block mb-2 text-lg font-bold text-gray-700 hover:text-blue-600"
                    href={tool.previewUrl}
                    target="_blank"
                  >
                    {tool.name}
                  </Link>

                  {/* 工具描述 */}
                  <Link
                    className="block mb-2 text-sm text-gray-500 hover:text-blue-600"
                    href={tool.previewUrl}
                    target="_blank"
                  >
                    {tool.summary}
                  </Link>

                  {/* 工具状态 */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">是否可用：</span>
                    <span className="text-sm text-blue-600">{tool.type}</span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="pb-2">
                    <Link
                      className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      href={tool.previewUrl}
                    >
                      打开使用
                    </Link>
                  </div>

                  {/* 备注信息 */}
                  <div className="text-xs text-gray-400">{tool.remark}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 右侧边栏 */}
          <div className="right-0 col-span-3 ml-5 rounded">
            <div className="fixed w-[236px]">
              <Author />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
