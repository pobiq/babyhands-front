import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login, socialLogin } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import handicon from "/images/handicon.png";
import styles from "../styles/pages/LoginPage.module.css";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await login({
        loginId: id,
        password: password,
      });

      setAccessToken(data.accessToken);
      sessionStorage.setItem("nickname", data.nickname);
      navigate("/main");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const baseInputClass = `${styles.inputBase} ${styles.inputFocus} text-base text-black`;

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
          {/* 제목 */}
          <h1 className={styles.title}>로그인</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 아이디 입력 필드 */}
            <div className="space-y-2">
              <label
                htmlFor="id"
                className="block text-base font-normal text-black"
              >
                아이디
              </label>
              <div className="relative">
                <input
                  id="id"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="아이디를 입력하세요."
                  className={baseInputClass}
                />
              </div>
            </div>

            {/* 비밀번호 입력 필드 */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-base font-normal text-black"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••"
                  className={`${baseInputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 3m3.29 3.29L12 12m-5.71-5.71L12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className={styles.errorBox}>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 아이디 찾기 / 비밀번호 찾기 */}
            <div className="flex justify-between text-base font-normal text-black">
              <button
                type="button"
                className="hover:text-blue-600 transition-colors"
              >
                아이디 찾기
              </button>
              <button
                type="button"
                className="hover:text-blue-600 transition-colors"
              >
                비밀번호 찾기
              </button>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-base font-normal rounded-md transition-colors flex items-center justify-center"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>

            {/* SNS 로그인 버튼 */}
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                className={styles.iconButton}
                id="googleLoginButton"
                title="구글로 로그인"
                onClick={() => handleSocialLogin("google")}
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
              </button>

              <button
                type="button"
                className={styles.iconButton}
                id="naverLoginButton"
                title="네이버로 로그인"
                onClick={() => handleSocialLogin("naver")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 18 18"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <rect width="18" height="18" fill="#03C75A" rx="2" />
                  <path
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    strokeLinecap="round"
                    fill="none"
                    d="M6 5.5v7M6 5.5l6 7M12 5.5v7"
                  />
                </svg>
              </button>

              <button
                type="button"
                className={styles.iconButton}
                id="kakaoLoginButton"
                title="카카오로 로그인"
                onClick={() => handleSocialLogin("kakao")}
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
              </button>
            </div>

            {/* 구분선 */}
            <div className={styles.divider} />
          </form>
        </div>
      </div>
    </div>
  );
}
