'use client';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100 p-4">
      {/* Mobile Container with fixed aspect ratio (375:812 = 1:2.165) */}
      <div className="mobile-container relative w-full max-w-[375px] max-h-[812px] aspect-[375/812] bg-gradient-to-b from-[#1DB954] to-[#1AA34A] shadow-2xl overflow-hidden">
        {/* Using absolute positioning based on Figma percentages */}
        <div className="relative w-full h-full">
          
          {/* Header - top 0-5.05% */}
          <div className="absolute top-0 left-0 right-0 h-[5.05%] bg-[#1AA34A] flex items-center justify-center z-20">
            <div className="text-white font-bold text-[14px] absolute left-0 right-0 text-center">R2S - Reserve to Save</div>
            <button className="absolute right-[5.87%] w-[20px] h-[20px] bg-white/20 rounded-full flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3L3 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 3L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Clock Icon Circle - 9.17% from top, centered */}
          <div className="absolute top-[9.17%] left-[39.33%] right-[39.33%] h-[9.17%] flex items-center justify-center">
            <div className="w-full aspect-square bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/20">
              <span className="text-[30px]">⏰</span>
            </div>
          </div>

          {/* Main Title - 19.27% from top */}
          <div className="absolute top-[19.27%] left-[17.6%] right-[17.6%] text-center">
            <h1 className="text-white text-[28px] font-bold leading-[1.2] whitespace-nowrap">
              기다림을 할인으로
            </h1>
          </div>

          {/* Sub Title - 23.28% from top */}
          <div className="absolute top-[23.28%] left-[29.33%] right-[29.33%] text-center">
            <h2 className="text-white text-[28px] font-bold leading-[1.2] whitespace-nowrap">
              바꾸는 혁신
            </h2>
          </div>

          {/* Brand Name - 28.9% from top */}
          <div className="absolute top-[28.9%] left-[24.27%] right-[24.27%] text-center">
            <p className="text-white/90 text-[16px] font-bold whitespace-nowrap">
              R2S - Reserve to Save
            </p>
          </div>

          {/* Description Line 1 - 33.37% from top */}
          <div className="absolute top-[33.37%] left-[12%] right-[12%] text-center">
            <p className="text-white/80 text-[12px] whitespace-nowrap">
              공동구매 대기시간 동안 USDT를 예치하면
            </p>
          </div>

          {/* Description Line 2 - 35.66% from top */}
          <div className="absolute top-[35.66%] left-[8%] right-[8%] text-center">
            <p className="text-white/80 text-[12px] whitespace-nowrap">
              시간가치를 리베이트로 돌려받는 LINE Mini Dapp
            </p>
          </div>

          {/* Time Value Card - 41.28% from top */}
          <div className="absolute top-[41.28%] left-[5.33%] right-[5.33%] h-[11.47%]">
            <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex flex-col">
              <div className="flex-1 flex flex-col justify-center" style={{paddingLeft: '10px', paddingRight: '10px'}}>
                <h3 className="text-white text-[16px] font-bold mb-[8%] flex items-center">
                  <span className="mr-1 text-[14px]">💰</span> 시간가치 실현
                </h3>
                <div className="space-y-[4%]" style={{paddingLeft: '8px'}}>
                  <p className="text-white/90 text-[11px]">• 대기시간이 길수록 할인율 증가</p>
                  <p className="text-white/90 text-[11px]">• 실시간 할인 혜택 확인</p>
                  <p className="text-white/90 text-[11px]">• 평균 10-15% 할인 달성</p>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Card - 55.05% from top */}
          <div className="absolute top-[55.05%] left-[5.33%] right-[5.33%] h-[11.46%]">
            <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex flex-col">
              <div className="flex-1 flex flex-col justify-center" style={{paddingLeft: '10px', paddingRight: '10px'}}>
                <h3 className="text-white text-[16px] font-bold mb-[8%] flex items-center">
                  <span className="mr-1 text-[14px]">🛡️</span> 100% 안전보장
                </h3>
                <div className="space-y-[4%]" style={{paddingLeft: '8px'}}>
                  <p className="text-white/90 text-[11px]">• 스마트 컨트랙트 자동 관리</p>
                  <p className="text-white/90 text-[11px]">• 원금 100% 보전 시스템</p>
                  <p className="text-white/90 text-[11px]">• Kaia 블록체인 투명성 보장</p>
                </div>
              </div>
            </div>
          </div>

          {/* Example Card - 68.81% from top */}
          <div className="absolute top-[68.81%] left-[5.33%] right-[5.33%] h-[9.17%]">
            <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex flex-col">
              <div className="flex-1 flex flex-col justify-center" style={{paddingLeft: '10px', paddingRight: '10px'}}>
                <h3 className="text-white text-[14px] font-bold mb-[5%] flex items-center">
                  <span className="mr-1 text-[12px]">☕</span> 실제 예시: 원두 공동구매
                </h3>
                <p className="text-white/90 text-[11px] mb-[3%]" style={{paddingLeft: '8px'}}>
                  원가 100 USDT → 3일 대기 → 15% 할인
                </p>
                <p className="text-[#FFD700] font-bold text-[14px]" style={{paddingLeft: '8px'}}>
                  💰 최종 85 USDT (15 USDT 절약!)
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button - 81.42% from top */}
          <div className="absolute top-[81.42%] left-[8%] right-[8%] h-[6.42%]">
            <button className="w-full h-full bg-white text-[#00C73C] font-bold text-[16px] rounded-full hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center">
              지금 시작하기 🚀
            </button>
          </div>

          {/* Footer Text - 91.86% from top */}
          <div className="absolute top-[91.86%] left-[20%] right-[20%] text-center">
            <p className="text-white/70 text-[10px]">
              LINE 친구들과 함께 더 많이 절약하세요
            </p>
          </div>

          {/* Footer Stats - 94.61% from top */}
          <div className="absolute top-[94.61%] left-0 right-0 flex justify-center">
            <div className="flex gap-[15px]">
              <span className="text-white/60 text-[9px]">👥 10만+ 사용자</span>
              <span className="text-white/60 text-[9px]">⭐ 평균 12% 할인</span>
              <span className="text-white/60 text-[9px]">🔒 100% 안전</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}