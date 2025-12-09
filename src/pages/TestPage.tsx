import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitTest, getTestList } from "../services/testService";
import type { TestAnswer } from "../services/testService";

interface Question {
  id: number;
  questionId: number; // 백엔드 SignLanguage ID (sl_id)
  videoUrl: string; // 비디오 경로
  options: string[]; // 선택지
}

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // 모든 답변 저장
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const totalQuestions = questions.length;

  // API에서 테스트 문제 가져오기
  useEffect(() => {
    const fetchTestList = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const testList = await getTestList();

        // 백엔드 응답을 프론트엔드 형식으로 변환
        const formattedQuestions: Question[] = testList.map((item, index) => ({
          id: index + 1,
          questionId: item.sl_id,
          videoUrl: item.video_path,
          options: item.answers,
        }));

        setQuestions(formattedQuestions);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "테스트 문제를 불러오는데 실패했습니다.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestList();
  }, []);

  const currentQuestionData = questions[currentQuestion - 1];

  // 문제 변경 시 저장된 답변 불러오기
  useEffect(() => {
    const savedAnswer = answers[currentQuestion];
    setSelectedAnswer(savedAnswer || null);
  }, [currentQuestion, answers]);

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      // 현재 답변 저장
      if (selectedAnswer) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion]: selectedAnswer,
        }));
      }
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  //  currentQuestion이나 currentQuestionData.videoUrl이 변경될 때마다 비디오를 로드합니다.
  useEffect(() => {
    if (videoRef.current && currentQuestionData) {
      // 비디오 URL이 변경되면
      if (videoRef.current.src !== currentQuestionData.videoUrl) {
        // 비디오 소스를 명시적으로 설정
        videoRef.current.src = currentQuestionData.videoUrl;
        // 비디오 요소를 다시 로드
        videoRef.current.load();
        // 필요하다면 다시 재생
        // videoRef.current.play().catch(e => console.error("Auto-play failed:", e));
      }
    }
  }, [currentQuestion, currentQuestionData]); // currentQuestion이 변경될 때마다 실행

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      // 현재 답변 저장
      if (selectedAnswer) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion]: selectedAnswer,
        }));
      }
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswer(option);
    // 답변 선택 시 즉시 저장
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  const handleSubmit = async () => {
    // 현재 답변도 저장
    if (selectedAnswer) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion]: selectedAnswer,
      }));
    }

    let correctAnswerCount = 0;
    // 정답 갯수 카운트
    questions.forEach((q) => {
      if (q.options[0] === answers[q.id]) {
        correctAnswerCount++;
      }
    });

    // 모든 답변이 있는지 확인
    const allAnswers = questions.map((q) => ({
      questionId: q.questionId,
      chooseAnswer: answers[q.id] || "",
    }));

    // 빈 답변이 있는지 확인
    const hasEmptyAnswer = allAnswers.some((a) => !a.chooseAnswer);
    if (hasEmptyAnswer) {
      setError("모든 문제에 답변을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData: TestAnswer[] = allAnswers.map((a) => ({
        questionId: a.questionId,
        chooseAnswer: a.chooseAnswer,
      }));

      await submitTest(submitData);

      // 성공 시 결과를 표시하거나 메인 페이지로 이동
      alert(
        `테스트가 완료되었습니다!\n정답: ${correctAnswerCount}/${totalQuestions}`
      );
      navigate("/main");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "테스트 제출에 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-[24px] font-bold text-black mb-4">
            테스트 문제를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  // 에러가 있거나 문제가 없을 때
  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen w-full bg-slate-50 py-10">
        <div className="container mx-auto px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 text-lg">
              {error || "테스트 문제를 불러올 수 없습니다."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 py-10">
      {/* 제목 */}
      <div className="container mx-auto px-8 mb-8">
        <h1 className="text-center text-[32px] font-bold text-black">
          수어 학습 테스트
        </h1>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 비디오 플레이어 카드 */}
          <div className="bg-white rounded-[10px] shadow-lg p-6">
            <h2 className="text-[20px] font-bold text-black mb-4">
              문제 영상 {currentQuestion}/{totalQuestions}
            </h2>

            {/* 비디오 플레이어 */}
            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
              {/* 비디오 */}
              <video
                ref={videoRef}
                className="w-full h-auto"
                controls
                controlsList="nodownload"
              >
                <source src={currentQuestionData.videoUrl} type="video/mp4" />
                비디오를 재생할 수 없습니다.
              </video>
            </div>
          </div>

          {/* 오른쪽: 정답 선택 카드 */}
          <div className="bg-white rounded-[10px] shadow-lg p-6">
            <h2 className="text-[20px] font-bold text-black mb-6">정답 선택</h2>

            {/* 선택지 */}
            <div className="space-y-4 mb-8">
              {currentQuestionData.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAnswer === option
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => handleAnswerSelect(option)}
                    className="w-5 h-5 text-purple-600"
                  />
                  <span className="text-[18px] text-black">{option}</span>
                </label>
              ))}
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 1 || isSubmitting}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  currentQuestion === 1 || isSubmitting
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-black border-2 border-gray-300 hover:bg-gray-50"
                }`}
              >
                이전
              </button>
              {currentQuestion === totalQuestions ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedAnswer}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                    isSubmitting || !selectedAnswer
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isSubmitting ? "제출 중..." : "제출하기"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  다음
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
