"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useAuthCheck } from "../hooks/useAuthCheck";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, isHydrated } = useAuth();
  const router = useRouter();

  // 在应用启动时检查认证状态
  useAuthCheck();

  useEffect(() => {
    // 只有在状态恢复完成且不在加载中且未认证时才跳转
    if (isHydrated && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, isHydrated, router]);

  // 如果状态还未恢复或正在加载，显示加载状态
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
