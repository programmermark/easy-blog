import { useState, useEffect, useCallback } from "react";

export interface Visitor {
  id: string;
  nickname: string;
  email: string;
  site?: string;
  avatarUrl?: string;
}

export interface UseAuthReturn {
  isLoggedIn: boolean;
  userAvatar: string;
  visitor: Visitor | null;
  checkLoginStatus: () => void;
  updateAvatar: (avatar: string) => void;
  updateVisitor: (visitor: Visitor) => void;
}

export function useAuth(): UseAuthReturn {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [visitor, setVisitor] = useState<Visitor | null>(null);

  // 检查登录状态
  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem("token");
    const visitorData = localStorage.getItem("visitor");

    if (token && visitorData) {
      try {
        const parsedVisitor = JSON.parse(visitorData);
        setVisitor(parsedVisitor);
        setUserAvatar(parsedVisitor.avatarUrl || "");
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to parse visitor data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("visitor");
        setIsLoggedIn(false);
        setVisitor(null);
        setUserAvatar("");
      }
    } else {
      setIsLoggedIn(false);
      setVisitor(null);
      setUserAvatar("");
    }
  }, []);

  // 更新头像
  const updateAvatar = useCallback((avatar: string) => {
    setUserAvatar(avatar);
    if (visitor) {
      const updatedVisitor = { ...visitor, avatarUrl: avatar };
      setVisitor(updatedVisitor);
      localStorage.setItem("visitor", JSON.stringify(updatedVisitor));
    }
  }, [visitor]);

  // 更新访客信息
  const updateVisitor = useCallback((newVisitor: Visitor) => {
    setVisitor(newVisitor);
    setUserAvatar(newVisitor.avatarUrl || "");
    setIsLoggedIn(true);
    localStorage.setItem("token", newVisitor.id);
    localStorage.setItem("visitor", JSON.stringify(newVisitor));
  }, []);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      checkLoginStatus();
    });

    return () => cancelAnimationFrame(frameId);
  }, [checkLoginStatus]);

  return {
    isLoggedIn,
    userAvatar,
    visitor,
    checkLoginStatus,
    updateAvatar,
    updateVisitor,
  };
}
