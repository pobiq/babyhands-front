import axios from "axios";
import { apiClient } from "./authService";

export interface TestAnswer {
  questionId: number;
  chooseAnswer: string;
}

export interface TestSubmitRequest {
  answers: TestAnswer[];
}

/**
 * 테스트 문제 리스트 응답 DTO
 */
export interface TestListResponse {
  sl_id: number;
  meaning: string;
  video_path: string;
  answers: string[];
}

/**
 * 테스트 문제 리스트 가져오기
 * @returns 테스트 문제 리스트 (5문제)
 */
export const getTestList = async (): Promise<TestListResponse[]> => {
  try {
    const response = await apiClient.get<TestListResponse[]>(
      "/api/tests/getTestList"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "테스트 문제를 가져오는데 실패했습니다.";
      throw new Error(errorMessage);
    }
    throw new Error("테스트 문제를 가져오는데 실패했습니다.");
  }
};

/**
 * 테스트 제출 API 호출
 * @param submitData 테스트 답변 리스트
 * @returns 테스트 결과
 */
export const submitTest = async (submitData: TestSubmitRequest) => {
  try {
    const response = await apiClient.post(
      "/api/tests/submit",
      submitData.answers
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "테스트 제출에 실패했습니다.";
      throw new Error(errorMessage);
    }
    throw new Error("테스트 제출에 실패했습니다.");
  }
};
