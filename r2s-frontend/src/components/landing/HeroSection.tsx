'use client';

export default function HeroSection() {
  return (
    <div className="px-[20px] py-[32px] text-center space-y-[16px]">
      {/* Main Icon */}
      <div className="flex justify-center py-[16px]">
        <span className="text-[36px]">⏰</span>
      </div>

      {/* Main Title */}
      <div className="space-y-[8px]">
        <h1 className="text-white text-[32px] font-bold leading-[1.2]">
          기다림을 할인으로
        </h1>
        <h1 className="text-white text-[32px] font-bold leading-[1.2]">
          바꾸는 혁신
        </h1>
      </div>

      {/* Subtitle */}
      <div className="py-[8px]">
        <p className="text-white text-[18px] font-semibold">
          R2S - Reserve to Save
        </p>
      </div>

      {/* Description */}
      <div className="space-y-[4px]">
        <p className="text-white/90 text-[14px] leading-[1.2]">
          공동구매 대기시간 동안 USDT를 예치하면
        </p>
        <p className="text-white/90 text-[14px] leading-[1.2]">
          시간가치를 리베이트로 돌려받는 LINE Mini Dapp
        </p>
      </div>
    </div>
  );
}