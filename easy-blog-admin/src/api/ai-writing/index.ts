import requestClient from "@/lib/request-client";
import { cache, generateCacheKey } from "@/utils/cache";

/**
 * 生成标题请求参数
 */
export interface GenerateTitleRequest {
  content: string;
  style?: "concise" | "attractive" | "technical" | "seo";
}

/**
 * 生成摘要请求参数
 */
export interface GenerateSummaryRequest {
  content: string;
  maxLength?: number;
}

/**
 * 生成内容请求参数
 */
export interface GenerateContentRequest {
  prompt: string;
  context?: string;
  model?: string;
}

/**
 * 优化内容请求参数
 */
export interface OptimizeContentRequest {
  content: string;
  instruction?: string;
  model?: string;
}

/**
 * 续写请求参数
 */
export interface ContinueWritingRequest {
  content: string;
  position?: number;
}

/**
 * 分析文章请求参数
 */
export interface AnalyzeArticleRequest {
  content: string;
  title?: string;
}

/**
 * API 响应类型
 */
export interface AIWritingResponse {
  content: string;
}

/**
 * 分析文章响应类型
 */
export interface AnalyzeArticleResponse {
  analysis: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

/**
 * AI 写作 API 客户端
 */
const aiWritingApi = {
  /**
   * 生成文章标题
   */
  generateTitle: async (data: GenerateTitleRequest): Promise<string> => {
    const cacheKey = generateCacheKey("generateTitle", data);
    const cached = cache.get<string>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await requestClient.post<AIWritingResponse>(
      "/ai/writing/generate-title",
      data,
    );
    const content = response.data.content;
    cache.set(cacheKey, content, 10 * 60 * 1000); // 缓存10分钟
    return content;
  },

  /**
   * 生成文章摘要
   */
  generateSummary: async (data: GenerateSummaryRequest): Promise<string> => {
    const cacheKey = generateCacheKey("generateSummary", data);
    const cached = cache.get<string>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await requestClient.post<AIWritingResponse>(
      "/ai/writing/generate-summary",
      data,
    );
    const content = response.data.content;
    cache.set(cacheKey, content, 10 * 60 * 1000); // 缓存10分钟
    return content;
  },

  /**
   * 生成文章内容
   */
  generateContent: async (data: GenerateContentRequest): Promise<string> => {
    const response = await requestClient.post<AIWritingResponse>(
      "/ai/writing/generate-content",
      data,
    );
    return response.data.content;
  },

  /**
   * 优化文章内容
   */
  optimizeContent: async (data: OptimizeContentRequest): Promise<string> => {
    const response = await requestClient.post<AIWritingResponse>(
      "/ai/writing/optimize",
      data,
    );
    return response.data.content;
  },

  /**
   * 续写文章
   */
  continueWriting: async (
    data: ContinueWritingRequest,
  ): Promise<string> => {
    const response = await requestClient.post<AIWritingResponse>(
      "/ai/writing/continue",
      data,
    );
    return response.data.content;
  },

  /**
   * 分析文章质量
   */
  analyzeArticle: async (
    data: AnalyzeArticleRequest,
  ): Promise<AnalyzeArticleResponse> => {
    const response = await requestClient.post<AnalyzeArticleResponse>(
      "/ai/writing/analyze",
      data,
    );
    return response.data;
  },
};

export default aiWritingApi;

