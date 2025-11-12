"use client";

import Cookies from "js-cookie";

// Cookie 配置
const isSecureContext = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";

const COOKIE_OPTIONS = {
  expires: 7, // 7天过期
  secure: isSecureContext(), // 仅在 HTTPS 环境使用 Secure 标记
  sameSite: "lax" as const, // CSRF 保护
};

// Token 相关 cookie 操作
export const tokenCookies = {
  set: (token: string) => {
    if (typeof window !== "undefined") {
      Cookies.set("accessToken", token, COOKIE_OPTIONS);
    }
  },

  get: (): string | undefined => {
    if (typeof window !== "undefined") {
      return Cookies.get("accessToken");
    }
    return undefined;
  },

  remove: () => {
    if (typeof window !== "undefined") {
      Cookies.remove("accessToken");
    }
  },
};

// Refresh token 相关 cookie 操作
export const refreshTokenCookies = {
  set: (token: string) => {
    if (typeof window !== "undefined") {
      Cookies.set("refreshToken", token, { ...COOKIE_OPTIONS, expires: 30 }); // 30天过期
    }
  },

  get: (): string | undefined => {
    if (typeof window !== "undefined") {
      return Cookies.get("refreshToken");
    }
    return undefined;
  },

  remove: () => {
    if (typeof window !== "undefined") {
      Cookies.remove("refreshToken");
    }
  },
};

// 清除所有认证相关的 cookie
export const clearAuthCookies = () => {
  tokenCookies.remove();
  refreshTokenCookies.remove();
};
