'use client';

export default function ExampleCard() {
  return (
    <div className="w-full h-full bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-md rounded-[16px] border border-white/30 shadow-xl">
      <div className="flex flex-col justify-center h-full px-[20px] py-[16px]">
        <div className="flex items-center mb-[8px]">
          <span className="text-[20px] mr-[8px]">☕</span>
          <h3 className="text-white text-[15px] font-bold">
            실제 예시: 원두 공동구매
          </h3>
        </div>
        <div className="pl-[28px] space-y-[4px]">
          <p className="text-white/90 text-[13px]">
            원가 100 USDT → 3일 대기 → 15% 할인
          </p>
          <p className="text-[#FFD700] font-bold text-[16px]">
            💰 최종 85 USDT (15 USDT 절약!)
          </p>
        </div>
      </div>
    </div>
  );
}