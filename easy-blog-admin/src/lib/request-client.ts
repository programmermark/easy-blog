import axios from "axios";
import { tokenCookies, refreshTokenCookies, clearAuthCookies } from "./cookies";

const requestClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8000",
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = refreshTokenCookies.get();
        if (!refreshToken) throw new Error("No refresh token");

        // 刷新 token
        const response = await requestClient.post("/auth/refresh", {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        tokenCookies.set(accessToken);

        // 重新发送请求
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return requestClient(originalRequest);
      } catch (refreshError) {
        // 刷新失败，清除所有认证 cookie
        clearAuthCookies();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
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
