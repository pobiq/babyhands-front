import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
}

const TOKEN_STORAGE_KEY = "auth-token";

// localStorage에서 토큰 로드
const loadTokenFromStorage = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
  return null;
};

// localStorage에 토큰 저장
const saveTokenToStorage = (token: string | null): void => {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }
};

/**
 * 인증 상태 관리 Store
 * localStorage에 토큰 저장
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: loadTokenFromStorage(),
  isAuthenticated: !!loadTokenFromStorage(),
  setAccessToken: (token) => {
    saveTokenToStorage(token);
    set({
      accessToken: token,
      isAuthenticated: !!token,
    });
  },
  clearAuth: () => {
    saveTokenToStorage(null);
    set({
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));

