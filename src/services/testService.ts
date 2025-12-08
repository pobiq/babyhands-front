import axios from "axios";
import { apiClient } from "./authService";

export interface TestAnswer {
  questionId: number;
  chooseAnswer: string;
}

export interface TestSubmitRequest {
  answers: TestAnswer[];
  groupId?: number;
}

export interface TestSubmitResponse {
  message: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}

/**
 * 테스트 제출 API 호출
 * @param submitData 테스트 답변 리스트
 * @returns 테스트 결과
 */
export const submitTest = async (
  submitData: TestSubmitRequest
): Promise<TestSubmitResponse> => {
  try {
    const response = await apiClient.post<TestSubmitResponse>(
      "/api/tests/submit",
      submitData
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

