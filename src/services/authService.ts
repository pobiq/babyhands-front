import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const API_BASE_URL = "http://localhost:8090";

// axios 인스턴스 생성 (다른 서비스에서도 사용 가능하도록 export)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CORS 쿠키 전송을 위해 필요
});

// 요청 인터셉터: 모든 요청에 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  loginId: string;
  password: string;
}

interface LoginResponse {
  nickname: string;
  accessToken: string;
}

/**
 * 로그인 API 호출
 * @param loginData 로그인 정보 (loginId, password)
 * @returns accessToken
 */
export const login = async (
  loginData: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/api/members/login",
      loginData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data || error.message || "로그인에 실패했습니다.";
      throw new Error(errorMessage);
    }
    throw new Error("로그인에 실패했습니다.");
  }
};

/**
 * 로그아웃 API 호출
 * 백엔드에 로그아웃 요청을 보내고, 클라이언트 상태도 초기화
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post("/api/members/logout");
  } catch (error) {
    // 백엔드 요청이 실패해도 클라이언트 상태는 초기화
    console.error("Logout error:", error);
  } finally {
    // 백엔드 요청 성공 여부와 관계없이 클라이언트 상태 초기화
    useAuthStore.getState().clearAuth();
  }
};

/**
 * 소셜 로그인 시작
 * 백엔드 OAuth2 엔드포인트로 리다이렉트
 * @param provider 소셜 로그인 제공자 (google, kakao, naver)
 */
export const socialLogin = (provider: string): void => {
  const validProviders = ["google", "kakao", "naver"];

  if (!validProviders.includes(provider)) {
    throw new Error("지원하지 않는 소셜 로그인입니다.");
  }

  // 백엔드 OAuth2 엔드포인트로 리다이렉트
  // Spring Security OAuth2 Client가 자동으로 생성하는 엔드포인트
  window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
};
