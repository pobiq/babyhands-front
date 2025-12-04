import axios from "axios";

const API_BASE_URL = "http://localhost:8090";

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CORS 쿠키 전송을 위해 필요
});

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
