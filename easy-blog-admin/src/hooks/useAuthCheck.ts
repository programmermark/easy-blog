import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth";

/**
 * 专门用于认证检查的 hook
 * 只在应用启动时检查一次认证状态
 */
export function useAuthCheck() {
  const { isHydrated, isAuthenticated, checkAuthStatus } = useAuthStore();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // 只有在状态恢复完成且未检查过认证状态时才检查
    if (isHydrated && !hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuthStatus();
    }
  }, [isHydrated, checkAuthStatus]);
}
