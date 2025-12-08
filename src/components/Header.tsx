import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export default function Header() {
  const navigate = useNavigate();

  const username = sessionStorage.getItem("nickname");

  const handleLogout = async () => {
    try {
      // 백엔드 로그아웃 API 호출 (내부에서 클라이언트 상태도 초기화됨)
      await logout();
      sessionStorage.removeItem("nickname");
      navigate("/login");
    } catch (error) {
      // 에러가 발생해도 클라이언트 상태는 초기화되므로 로그인 페이지로 이동
      console.error("Logout error:", error);
      sessionStorage.removeItem("nickname");
      navigate("/login");
    }
  };

  return (
    <>
      {/* 상단 네비게이션 바 */}
      <nav className="relative w-full bg-white shadow-sm">
        <div className="flex items-center justify-between px-8 py-4">
          {/* 왼쪽: 브랜드 */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-lg">👋</span>
            </div>
            <span className="text-xs text-black">꼬마손</span>
          </div>

          {/* 중앙: 탭 메뉴 */}
          <div className="flex items-center gap-8 text-[20px] text-black">
            <button className="hover:text-blue-600 transition-colors">
              학습하기
            </button>
            <button className="hover:text-blue-600 transition-colors">
              테스트
            </button>
            <button className="hover:text-blue-600 transition-colors">
              랭킹
            </button>
            <button className="hover:text-blue-600 transition-colors">
              마이페이지
            </button>
          </div>

          {/* 오른쪽: 닉네임 및 로그아웃 */}
          <div className="flex items-center gap-4">
            <span className="text-[20px] text-black">{username}</span>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-md transition-colors"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
