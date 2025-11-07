import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, LoginDto, LoginResponse } from "../types/index";
import api from "../lib/api";
import { tokenCookies, clearAuthCookies } from "../lib/cookies";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean; // 添加状态恢复标志

  // Actions
  login: (loginData: LoginDto) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isHydrated: false,

      login: async (loginData: LoginDto) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<LoginResponse>(
            "/auth/login",
            loginData
          );
          const { access_token, user } = response.data;

          // 存储 token 到 cookie
          tokenCookies.set(access_token);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          set({
            error: error instanceof Error ? error.message : "登录失败",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        clearAuthCookies();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuthStatus: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get("/auth/me");
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // 在存储时检查 cookie 中的 token
      onRehydrateStorage: () => (state) => {
        if (state) {
          const token = tokenCookies.get();
          if (!token) {
            // 如果没有 token，清除用户状态
            state.user = null;
            state.isAuthenticated = false;
          }
          // 标记状态已恢复
          state.isHydrated = true;
        }
      },
    }
  )
);
