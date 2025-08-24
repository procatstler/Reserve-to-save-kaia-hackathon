'use client';

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center">
      {/* Main Icon with proper padding */}
      <div className="absolute top-[8%] left-[50%] transform -translate-x-1/2">
        <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 shadow-xl">
          <span className="text-[36px] sm:text-[40px]">⏰</span>
        </div>
      </div>

      {/* Main Title with proper spacing */}
      <div className="absolute top-[18%] left-0 right-0 px-[20px] sm:px-[24px] text-center">
        <h1 className="text-white text-[28px] sm:text-[32px] font-bold leading-[1.2] mb-[10px]">
          기다림을 할인으로
          <br />
          바꾸는 혁신
        </h1>
        <p className="text-white/90 text-[16px] sm:text-[18px] font-semibold">
          R2S - Reserve to Save
        </p>
      </div>

      {/* Description with comfortable padding */}
      <div className="absolute top-[31%] left-0 right-0 px-[24px] sm:px-[32px] text-center">
        <p className="text-white/85 text-[12px] sm:text-[13px] leading-[1.6]">
          공동구매 대기시간 동안 USDT를 예치하면
          <br />
          시간가치를 리베이트로 돌려받는 LINE Mini Dapp
        </p>
      </div>
    </div>
  );
}