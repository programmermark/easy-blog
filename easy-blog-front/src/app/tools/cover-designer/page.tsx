"use client";

import { useState, useEffect, useRef } from "react";
import { message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as htmlToImage from "html-to-image";
import { env } from "@/env";

// 类型定义
type CoverImageType = "png" | "jpg" | "svg";

interface ICoverDesigner {
  title: string /** 封面标题 */;
  subTitle: string /** 封面小标题 */;
  image1: string /** 封面配图1 */;
  image2: string /** 封面配图2 */;
  template: string /** 模板类型 */;
  name: string /** 封面图片名称 */;
  imageType: CoverImageType /** 图片类型 */;
}

export default function CoverDesignerPage() {
  // 封面图片类型
  const imageTypes: CoverImageType[] = ["png", "jpg", "svg"];

  // 是否下载封面
  const [isDownload, setIsDownload] = useState(false);

  // 表单数据
  const [form, setForm] = useState<ICoverDesigner>({
    title: "" /** 封面标题 */,
    subTitle: "" /** 封面小标题 */,
    image1: "" /** 封面配图1 */,
    image2: "" /** 封面配图2 */,
    template: "模板1" /** 封面模板 */,
    name: "cover" /** 封面图片名称 */,
    imageType: "png" /** 图片类型 */,
  });

  // 更新是否下载
  const handleIsDownloadUpdate = (download: boolean) => {
    setIsDownload(download);
  };

  // 上传配图成功处理
  const handleImageSuccess = (response: any, type: "image1" | "image2") => {
    message.success("上传图片成功");
    // 后端直接返回文件信息，不是包装在success/data中
    const imageUrl = `${env.NEXT_PUBLIC_API_BASE_URL}${response.url}`;
    if (type === "image1") {
      setForm((prev) => ({ ...prev, image1: imageUrl }));
    } else {
      setForm((prev) => ({ ...prev, image2: imageUrl }));
    }
  };

  // 自定义上传方法
  const customUpload = async ({ file, onSuccess, onError }: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(env.NEXT_PUBLIC_UPLOAD_URL, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined" ? localStorage.getItem("token") : ""
          }`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        onSuccess(result);
      } else {
        onError(new Error("上传失败"));
      }
    } catch (error) {
      onError(error);
    }
  };

  // 创建上传配置函数
  const createUploadProps = (imageType: "image1" | "image2") => ({
    name: "file",
    customRequest: customUpload,
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status === "done") {
        const response = info.file.response;
        // 检查响应是否包含url字段（成功）或error字段（失败）
        if (response.url) {
          handleImageSuccess(response, imageType);
        } else if (response.error) {
          message.error(response.message || "上传失败");
        } else {
          message.error("上传失败");
        }
      } else if (info.file.status === "error") {
        message.error("上传失败");
      }
    },
  });

  // 加载示例数据
  const loadExampleData = () => {
    const exampleData: ICoverDesigner = {
      title: "手写前端面试题" /** 封面标题 */,
      subTitle: "每天一篇短文章，每天进步一点点" /** 封面小标题 */,
      image1:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwx3.sinaimg.cn%2Fmw690%2F5f808b33ly1gtiphdw1qmj210z117jx2.jpg&refer=http%3A%2F%2Fwx3.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1635558644&t=7e78332ae1fd1fabdc7c055225e74f27" /** 封面配图1 */,
      image2:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201604%2F09%2F20160409012110_XEfFy.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1635563063&t=a59acdafb19a06f13d9ecb5607255858" /** 封面配图2 */,
      template: "模板1" /** 封面模板 */,
      name: "cover" /** 封面图片名称 */,
      imageType: "png" /** 图片类型 */,
    };
    setForm(exampleData);
  };

  // 执行下载命令
  const downCoverImage = () => setIsDownload(true);

  // 重置配图参数
  const resetForm = () => {
    const initData: ICoverDesigner = {
      title: "" /** 封面标题 */,
      subTitle: "" /** 封面小标题 */,
      image1: "" /** 封面配图1 */,
      image2: "" /** 封面配图2 */,
      template: "模板1" /** 封面模板 */,
      name: "cover" /** 封面图片名称 */,
      imageType: "png" /** 图片类型 */,
    };
    setForm(initData);
  };

  // 组件挂载时加载示例数据
  useEffect(() => {
    loadExampleData();
  }, []);

  return (
    <div className="w-full bg-gray-100">
      <div className="max-w-6xl m-auto">
        {/* 标题 */}
        <div className="bg-white py-2 text-gray-700 text-2xl font-bold mt-4 pb-4 text-center rounded-tl-lg rounded-tr-lg border-b border-gray-200">
          文章封面生成器
        </div>

        <div className="grid grid-cols-12 mb-8 rounded-bl-lg rounded-br-lg bg-white">
          {/* 工具条 */}
          <div className="lg:col-span-4 md:col-span-12 rounded-bl-lg border-r border-gray-200 pt-5">
            <div className="px-4 space-y-3">
              {/* 封面标题 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  封面标题：
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="输入封面标题"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 封面小标题 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  封面小标题：
                </label>
                <input
                  type="text"
                  value={form.subTitle}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, subTitle: e.target.value }))
                  }
                  placeholder="输入封面小标题"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 封面配图1 */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  封面配图1：
                </label>
                <div className="relative flex">
                  <input
                    type="text"
                    value={form.image1}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, image1: e.target.value }))
                    }
                    placeholder="输入封面配图1或点击上传"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Upload {...createUploadProps("image1")}>
                    <Button
                      icon={<UploadOutlined />}
                      size="small"
                      className="!h-[42px] absolute right-0 top-0 px-3 border-l-0 rounded-l-none rounded-r border-gray-300 hover:border-blue-500"
                    >
                      上传
                    </Button>
                  </Upload>
                </div>
              </div>

              {/* 封面配图2 */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  封面配图2：
                </label>
                <div className="relative flex">
                  <input
                    type="text"
                    value={form.image2}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, image2: e.target.value }))
                    }
                    placeholder="输入封面配图2或点击上传"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Upload {...createUploadProps("image2")}>
                    <Button
                      icon={<UploadOutlined />}
                      size="small"
                      className="!h-[42px] absolute right-0 top-0 px-3 border-l-0 rounded-l-none rounded-r border-gray-300 hover:border-blue-500"
                    >
                      上传
                    </Button>
                  </Upload>
                </div>
              </div>

              {/* 生成图片名称 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  生成图片名称：
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="输入生成图片名称"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 生成图片格式 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  生成图片格式：
                </label>
                <select
                  value={form.imageType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      imageType: e.target.value as CoverImageType,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {imageTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* 操作按钮 */}
              <div className="mt-2 mb-4">
                <button
                  onClick={downCoverImage}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  生成文章封面
                </button>
              </div>
              <div className="mt-2 mb-4">
                <button
                  onClick={resetForm}
                  className="w-full py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  重置
                </button>
              </div>
            </div>
          </div>

          {/* 预览界面 */}
          <div className="lg:col-span-8 md:col-span-12 rounded-br-lg pt-5">
            <div className="mx-4 py-8 bg-gray-900 flex justify-center">
              <CoverTemplate1
                cover={form}
                isDownload={isDownload}
                onUpdateIsDownload={handleIsDownloadUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 封面模板组件
interface CoverTemplate1Props {
  cover: ICoverDesigner;
  isDownload: boolean;
  onUpdateIsDownload: (download: boolean) => void;
}

function CoverTemplate1({
  cover,
  isDownload,
  onUpdateIsDownload,
}: CoverTemplate1Props) {
  // 下载封面图片
  const downloadImage = () => {
    const node = document.getElementById("cover-designer");
    if (node) {
      const imageType = cover.imageType;
      let toImagePromise: Promise<string>;

      if (imageType === "png") {
        toImagePromise = htmlToImage.toPng(node, { quality: 0.95 });
      } else if (imageType === "jpg") {
        toImagePromise = htmlToImage.toJpeg(node, { quality: 0.95 });
      } else {
        toImagePromise = htmlToImage.toSvg(node, { quality: 0.95 });
      }

      toImagePromise
        .then(function (dataUrl) {
          const link = document.createElement("a");
          link.download = `${cover.name}.${cover.imageType}`;
          link.href = dataUrl;
          link.click();
          message.success("生成封面图片成功");
          onUpdateIsDownload(false);
        })
        .catch(function (error) {
          console.error("生成图片失败:", error);
          message.error("生成图片失败");
          onUpdateIsDownload(false);
        });
    }
  };

  // 监听下载状态
  useEffect(() => {
    if (isDownload) {
      downloadImage();
    }
  }, [isDownload]);

  return (
    <div
      id="cover-designer"
      className="relative w-[640px] h-[360px] bg-white overflow-hidden"
    >
      {/* Top-left circle */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -left-12 w-[200px] h-[200px] bg-purple-200 rounded-full grid place-items-center"
      >
        <svg
          className="w-[64px] h-[72px] ml-3 mt-3"
          viewBox="0 0 64 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M60 29.0718C65.3333 32.151 65.3333 39.849 60 42.9282L12 70.641C6.66668 73.7202 1.16801e-05 69.8712 1.19493e-05 63.7128L1.4372e-05 8.28719C1.46412e-05 2.12878 6.66668 -1.72022 12 1.35899L60 29.0718Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Right big circle */}
      <div
        aria-hidden="true"
        className="absolute w-[512px] h-[512px] bg-purple-200 rounded-full -top-20 -right-56"
      ></div>

      {/* Images */}
      <div className="absolute top-10 right-8">
        <img
          src={cover.image1}
          alt="封面配图1"
          className="object-cover w-64 shadow-2xl h-36 rounded-2xl rotate-3"
        />
        <img
          src={cover.image2}
          alt="封面配图2"
          className="object-cover w-64 translate-x-16 -translate-y-2 shadow-2xl h-36 rounded-2xl -rotate-3"
        />
      </div>

      {/* Play button */}
      <div className="absolute inset-y-0 grid items-center right-12">
        <a
          href="#"
          className="grid w-12 h-12 transition bg-purple-500 rounded-full ring-4 ring-white place-items-center hover:bg-purple-400"
        >
          <span className="sr-only"></span>
          <svg
            className="w-4 ml-1"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 7.26795C16.3333 8.03775 16.3333 9.96225 15 10.7321L3 17.6603C1.66667 18.4301 1.01267e-06 17.4678 1.07997e-06 15.9282L1.68565e-06 2.0718C1.75295e-06 0.532196 1.66667 -0.430054 3 0.339746L15 7.26795Z"
              fill="white"
            />
          </svg>
        </a>
      </div>

      {/* Content */}
      <div className="relative flex flex-col justify-end w-2/3 h-full p-8 space-y-4">
        <p className="text-xs font-semibold tracking-wider text-purple-600 uppercase">
          {cover.subTitle}
        </p>
        <h1 className="text-3xl font-extrabold text-gray-900">{cover.title}</h1>
        <div className="h-8"></div>
      </div>
    </div>
  );
}
