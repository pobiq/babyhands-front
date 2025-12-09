import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { socialLogin } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import handicon from "/images/handicon.png";
import styles from "../styles/pages/LoginPage.module.css";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // OAuth2 콜백 처리 (백엔드에서 리다이렉트된 경우)
  useEffect(() => {
    const token = searchParams.get("token");
    const nickname = searchParams.get("nickname");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("소셜 로그인에 실패했습니다.");
      // URL에서 에러 파라미터 제거
      navigate("/login", { replace: true });
      return;
    }

    if (token && nickname) {
      // 토큰 저장
      setAccessToken(token);
      sessionStorage.setItem("nickname", nickname);
      // URL에서 토큰 파라미터 제거
      navigate("/main", { replace: true });
    }
  }, [searchParams, navigate, setAccessToken]);

  const handleSocialLogin = (provider: string) => {
    try {
      setError(null);
      setIsLoading(true);
      // 백엔드 OAuth2 엔드포인트로 리다이렉트
      socialLogin(provider);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "소셜 로그인에 실패했습니다.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 flex flex-col md:flex-row items-center justify-center">
      {/* 왼쪽 노란색 손 이미지 영역 (CSS Module) */}
      <div className={`${styles.leftPanel} w-full md:w-1/2`}>
        <img src={handicon} alt="handicon" className={styles.handImage} />
      </div>

      {/* 로그인 카드 */}
      <div className="flex w-full md:w-1/2 h-full justify-center items-center p-4 md:p-0">
        <div className={`${styles.card}`}>
          {/* 로고 영역 */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">👋</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-black">꼬마손</span>
              <span className="text-sm text-gray-500">수어 학습 플랫폼</span>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            환영합니다
          </h1>

          {/* 환영 메시지 */}
          <p className="text-gray-600 text-center mb-8">
            소셜 계정으로 간편하게 시작하세요
          </p>

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm">로그인 중...</span>
            </div>
          )}

          {/* SNS 로그인 버튼 */}
          <div className="space-y-3 mb-6">
            {/* 구글 로그인 */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-14 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              id="googleLoginButton"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.158 6.656 3.58 9 3.58z"
                />
              </svg>
              <span className="text-base font-medium text-gray-700">
                구글로 로그인
              </span>
            </button>

            {/* 네이버 로그인 */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-14 bg-[#03C75A] text-white rounded-lg hover:bg-[#02b350] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              id="naverLoginButton"
              onClick={() => handleSocialLogin("naver")}
              disabled={isLoading}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect width="18" height="18" fill="white" rx="2" />
                <path
                  stroke="#03C75A"
                  strokeWidth={2}
                  strokeLinecap="round"
                  fill="none"
                  d="M6 5.5v7M6 5.5l6 7M12 5.5v7"
                />
              </svg>
              <span className="text-base font-medium">네이버로 로그인</span>
            </button>

            {/* 카카오 로그인 */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-14 bg-[#FEE500] rounded-lg hover:bg-[#FDD835] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              id="kakaoLoginButton"
              onClick={() => handleSocialLogin("kakao")}
              disabled={isLoading}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  fill="#3C1E1E"
                  d="M9 2C5.14 2 2 4.42 2 7.4c0 2.1 1.5 3.94 3.75 5.1L5 16l3.75-2.1c.25.03.5.05.75.05 3.86 0 7-2.42 7-5.4C16 4.42 12.86 2 9 2z"
                />
              </svg>
              <span className="text-base font-medium text-[#3C1E1E]">
                카카오로 로그인
              </span>
            </button>
          </div>

          {/* 안내 문구 */}
          <p className="text-xs text-gray-400 text-center mb-4">
            로그인 시 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
          </p>

          {/* 에러 메시지 */}
          {error && (
            <div className={styles.errorBox}>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
