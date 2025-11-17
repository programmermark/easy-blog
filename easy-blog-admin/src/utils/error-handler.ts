/**
 * 错误处理工具函数
 */

export interface ErrorInfo {
  message: string;
  type: 'network' | 'timeout' | 'api' | 'unknown';
  retryable: boolean;
}

/**
 * 解析错误信息
 */
export function parseError(error: any): ErrorInfo {
  // 网络错误
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        message: '请求超时，请检查网络连接后重试',
        type: 'timeout',
        retryable: true,
      };
    }
    return {
      message: '网络连接失败，请检查网络后重试',
      type: 'network',
      retryable: true,
    };
  }

  // API 错误
  const status = error.response?.status;
  const data = error.response?.data;

  switch (status) {
    case 400:
      return {
        message: data?.message || data?.details || '请求参数错误，请检查输入',
        type: 'api',
        retryable: false,
      };
    case 401:
      return {
        message: '登录已过期，请重新登录',
        type: 'api',
        retryable: false,
      };
    case 403:
      return {
        message: '没有权限执行此操作',
        type: 'api',
        retryable: false,
      };
    case 404:
      return {
        message: '请求的资源不存在',
        type: 'api',
        retryable: false,
      };
    case 429:
      return {
        message: '请求过于频繁，请稍后再试',
        type: 'api',
        retryable: true,
      };
    case 500:
    case 502:
    case 503:
      return {
        message: '服务器错误，请稍后重试',
        type: 'api',
        retryable: true,
      };
    default:
      return {
        message: data?.message || error.message || '操作失败，请重试',
        type: 'api',
        retryable: status >= 500,
      };
  }
}

/**
 * 获取友好的错误提示
 */
export function getErrorMessage(error: any): string {
  const errorInfo = parseError(error);
  return errorInfo.message;
}

/**
 * 判断错误是否可重试
 */
export function isRetryable(error: any): boolean {
  const errorInfo = parseError(error);
  return errorInfo.retryable;
}

