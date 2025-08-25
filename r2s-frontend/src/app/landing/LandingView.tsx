'use client';

import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

export default function LandingView() {
  return (
    <PageLayout containerBackground="gradient">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C73C] via-[#28A745] to-[#20C997]" />
      
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute top-40 right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-36 h-36 rounded-full bg-white/15 blur-2xl" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 h-full flex flex-col px-[24px] py-[40px]">
        {/* 헤더 로고 */}
        <div className="text-center mb-[40px]">
          <p className="text-white/90 text-[16px] font-medium">R2S - Reserve to Save</p>
        </div>

        {/* 메인 타이틀 */}
        <div className="text-center mb-[20px]">
          <div className="text-[36px] mb-[16px]">⏰</div>
          <h1 className="text-white text-[32px] font-bold leading-[1.2] mb-[8px]">
            기다림을 할인으로<br />
            바꾸는 혁신
          </h1>
          <p className="text-white/90 text-[18px] font-semibold mb-[12px]">
            R2S - Reserve to Save
          </p>
          <p className="text-white/80 text-[14px] leading-[1.6]">
            공동구매 대기시간 동안 USDT를 예치하면<br />
            시간가치를 리베이트로 돌려받는 LINE Mini Dapp
          </p>
        </div>

        {/* 특징 카드들 */}
        <div className="flex-1 flex flex-col gap-[16px] mb-[24px]">
          {/* 시간가치 실현 카드 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-[20px] border border-white/20">
            <h3 className="text-white text-[16px] font-bold mb-[12px]">💰 시간가치 실현</h3>
            <ul className="space-y-[6px]">
              <li className="text-white/90 text-[13px]">• 대기시간이 길수록 할인율 증가</li>
              <li className="text-white/90 text-[13px]">• 실시간 할인 혜택 확인</li>
              <li className="text-white/90 text-[13px]">• 평균 10-15% 할인 달성</li>
            </ul>
          </div>

          {/* 안전보장 카드 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-[20px] border border-white/20">
            <h3 className="text-white text-[16px] font-bold mb-[12px]">🛡️ 100% 안전보장</h3>
            <ul className="space-y-[6px]">
              <li className="text-white/90 text-[13px]">• 스마트 컨트랙트 자동 관리</li>
              <li className="text-white/90 text-[13px]">• 원금 100% 보전 시스템</li>
              <li className="text-white/90 text-[13px]">• Kaia 블록체인 투명성 보장</li>
            </ul>
          </div>

          {/* 예시 카드 */}
          <div className="bg-gradient-to-r from-[#FFA500]/20 to-[#FF6347]/20 backdrop-blur-sm rounded-[20px] p-[20px] border border-white/20">
            <h3 className="text-white text-[14px] font-bold mb-[8px]">☕ 실제 예시: 원두 공동구매</h3>
            <p className="text-white/90 text-[13px] mb-[4px]">
              원가 100 USDT → 3일 대기 → 15% 할인
            </p>
            <p className="text-white text-[14px] font-bold">
              💰 최종 85 USDT (15 USDT 절약!)
            </p>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="mb-[24px]">
          <Link href={ROUTES.campaigns} className="block">
            <Button 
              fullWidth
              size="xl"
              className="bg-white text-[#00C73C] hover:bg-white/95 font-bold shadow-2xl rounded-[16px] text-[18px] py-[16px]"
            >
              지금 시작하기 🚀
            </Button>
          </Link>
        </div>

        {/* 푸터 */}
        <div className="text-center">
          <p className="text-white/90 text-[13px] font-medium mb-[8px]">
            LINE 친구들과 함께 더 많이 절약하세요
          </p>
          <div className="flex justify-center gap-[20px]">
            <span className="text-white/70 text-[11px]">👥 10만+ 사용자</span>
            <span className="text-white/70 text-[11px]">⭐ 평균 12% 할인</span>
            <span className="text-white/70 text-[11px]">🔒 100% 안전</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}