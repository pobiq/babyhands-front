import { useState } from "react";

export default function MainPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // 출석한 날짜 (예시 데이터)
  const attendedDates = [1, 3, 23, 24, 28];

  // 오늘의 목표 진행률
  const todayProgress = 80;
  // 전체 진행률
  const overallProgress = 70;

  // 월 변경 함수
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 캘린더 날짜 생성
  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 월요일을 0으로

    const days = [];
    
    // 빈 칸 추가 (월요일 시작)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 실제 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

  // 원형 진행률 SVG 생성
  const CircularProgress = ({ progress, size = 120 }: { progress: number; size?: number }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#9333ea"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[40px] font-normal text-black">{progress}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      

      {/* 메인 컨텐츠 영역 */}
      <div className="container mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 출석 캘린더 카드 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[10px] shadow-lg p-6">
              <h2 className="text-[20px] font-bold text-black mb-4">출석 캘린더</h2>

              {/* 월 네비게이션 */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="text-xs text-black hover:text-blue-600 transition-colors"
                >
                  ‹
                </button>
                <span className="text-[20px] text-black">{monthNames[currentMonth]}</span>
                <button
                  onClick={handleNextMonth}
                  className="text-xs text-black hover:text-blue-600 transition-colors"
                >
                  ›
                </button>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekdays.map((day, index) => (
                  <div
                    key={day}
                    className={`flex items-center justify-center h-10 rounded-full text-[16px] ${
                      index === 6
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* 캘린더 그리드 */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={index} className="h-12"></div>;
                  }
                  
                  const isAttended = attendedDates.includes(day);
                  
                  return (
                    <div
                      key={index}
                      className="relative h-12 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xs text-black">{day}</span>
                      {isAttended && (
                        <div className="absolute top-1 right-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="#22c55e"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 오른쪽: 진행률 카드들 */}
          <div className="space-y-6">
            {/* 오늘의 목표 카드 */}
            <div className="bg-white rounded-[10px] shadow-lg p-6">
              <h2 className="text-[20px] font-bold text-black mb-6">오늘의 목표</h2>
              <div className="flex justify-center">
                <CircularProgress progress={todayProgress} />
              </div>
            </div>

            {/* 전체 진행률 카드 */}
            <div className="bg-white rounded-[10px] shadow-lg p-6">
              <h2 className="text-[20px] font-bold text-black mb-6">전체 진행률</h2>
              <div className="flex justify-center">
                <CircularProgress progress={overallProgress} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

