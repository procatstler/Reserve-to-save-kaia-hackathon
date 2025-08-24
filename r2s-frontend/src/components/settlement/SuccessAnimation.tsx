'use client';

export default function SuccessAnimation() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="relative">
        <div className="w-[80px] h-[80px] bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-[60px] h-[60px] bg-[#28A745] rounded-full flex items-center justify-center">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M6 15L12 21L24 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <span className="absolute -top-[10px] -left-[20px] text-[20px] opacity-60 animate-bounce">✨</span>
        <span className="absolute -top-[5px] -right-[25px] text-[16px] opacity-60 animate-pulse">🎊</span>
        <span className="absolute -bottom-[10px] -left-[25px] text-[18px] opacity-60 animate-bounce" style={{animationDelay: '0.2s'}}>🎉</span>
        <span className="absolute -bottom-[15px] -right-[20px] text-[14px] opacity-60 animate-pulse" style={{animationDelay: '0.1s'}}>⭐</span>
      </div>
    </div>
  );
}