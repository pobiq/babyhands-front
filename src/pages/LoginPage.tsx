import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handicon = "/src/assets/handicon.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log("Login:", { id, password });
    navigate("/main");
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col lg:flex-row items-center justify-center">
      
      {/* 왼쪽 노란색 손 이미지 영역 */}
      <div className="relative w-full lg:w-1/2 h-full lg:h-full flex items-center justify-center">
        <img src={handicon} alt="handicon" className="w-full h-full object-contain max-w-md lg:max-w-none" />
      </div>

      {/* 로그인 카드 */}
      <div className="flex w-full lg:w-1/2 h-full justify-center items-center p-4 lg:p-0">
        <div className="relative bg-white w-full max-w-[520px] h-auto lg:h-full gap-8 rounded-[10px] shadow-xl p-10 z-10">
          
          {/* 제목 */}
          <h1 className="text-[36px] font-bold text-black mb-8">로그인</h1>

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
                  type="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="아이디를 입력하세요."
                  className="w-full h-[50px] px-4 py-3 text-base text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full h-[50px] px-4 py-3 pr-12 text-base text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 3m3.29 3.29L12 12m-5.71-5.71L12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

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
              className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 text-white text-base font-normal rounded-md transition-colors flex items-center justify-center"
            >
              로그인
            </button>

            {/* 회원가입 버튼 */}
            <button
              type="button"
              className="w-full h-[50px] bg-yellow-400 hover:bg-yellow-500 text-[#0b2d4a] text-base font-normal rounded-md transition-colors flex items-center justify-center"
            >
              회원가입
            </button>

            {/* 구분선 */}
            <div className="w-full h-px bg-gray-200 my-4"></div>
          </form>
        </div>
      </div>
    </div>
  );
}
