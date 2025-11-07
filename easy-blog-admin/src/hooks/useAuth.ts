import { useAuthStore } from "../stores/auth";

/**
 * 自定义 hook 用于处理认证状态
 * 不包含认证检查逻辑，避免无限循环
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    isHydrated,
    login,
    logout,
    clearError,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isHydrated,
    login,
    logout,
    clearError,
  };
}
