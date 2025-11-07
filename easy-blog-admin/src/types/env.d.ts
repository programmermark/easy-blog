// src/types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // 仅服务端可见
    API_SECRET: string;

    // 客户端可见（会被内联到浏览器代码）
    NEXT_PUBLIC_API_BASE_URL: string;

    NODE_ENV: "development" | "production" | "test";
  }
}
