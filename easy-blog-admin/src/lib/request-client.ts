import axios from "axios";
import { tokenCookies, clearAuthCookies } from "./cookies";
import { withAdminBasePath } from "@/config/basePath";

const requestClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/blog-service",
  timeout: 10000,
  withCredentials: true, // 允许发送 cookies
});

// 请求拦截器
requestClient.interceptors.request.use(
  (config) => {
    // 从 cookie 获取 token
    const token = tokenCookies.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
requestClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      clearAuthCookies();
      if (typeof window !== "undefined") {
        window.location.href = withAdminBasePath("/login");
      }
      const authError = new Error("登录状态已过期，请重新登录");
      (authError as any).statusCode = 401;
      return Promise.reject(authError);
    }

    // 处理其他错误，提取后端返回的错误信息
    if (error.response?.data) {
      const { message, details, error: errorCode } = error.response.data;

      // 优先使用 details，如果没有则使用 message
      const errorMessage = details || message || "请求失败";

      // 创建一个新的错误对象，包含后端返回的具体信息
      const customError = new Error(errorMessage);
      (customError as any).statusCode = error.response.status;
      (customError as any).errorCode = errorCode;

      return Promise.reject(customError);
    }

    return Promise.reject(error);
  }
);

export default requestClient;
