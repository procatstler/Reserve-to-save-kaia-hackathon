'use client';

import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import R2SHeader from '@/components/common/R2SHeader';
import HeroSection from '@/components/landing/HeroSection';
import FeatureCard from '@/components/landing/FeatureCard';
import ExampleCard from '@/components/landing/ExampleCard';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

const features = [
  {
    icon: '💰',
    title: '시간가치 실현',
    items: [
      '대기시간이 길수록 할인율 증가',
      '실시간 할인 혜택 확인',
      '평균 10-15% 할인 달성'
    ]
  },
  {
    icon: '🛡️',
    title: '100% 안전보장',
    items: [
      '스마트 컨트랙트 자동 관리',
      '원금 100% 보전 시스템',
      'Kaia 블록체인 투명성 보장'
    ]
  }
];

export default function LandingPage() {
  return (
    <PageLayout containerBackground="gradient">
      <div className="flex flex-col min-h-screen">
        {/* 공통 R2S 헤더 */}
        <R2SHeader showClose />
        
        {/* Hero Section */}
        <section className="pt-[44px]">
          <HeroSection />
        </section>

        {/* Main Content */}
        <main className="flex-1 px-[20px] space-y-[16px] pt-[60px] pb-[40px]">
          {/* Feature Cards Section */}
          <div className="space-y-[12px]">
            {features.map((feature, index) => (
              <div key={index}>
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>

          {/* Example Card */}
          <div className="py-[12px]">
            <ExampleCard />
          </div>

          {/* CTA Button */}
          <div className="py-[16px]">
            <Link href={ROUTES.campaigns} className="block w-full">
              <Button 
                fullWidth
                variant="primary"
                size="xl"
                className="h-[56px] bg-white text-[#1DB954] hover:bg-white/95 font-bold shadow-xl rounded-[12px] text-[16px]"
              >
                지금 시작하기 →
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-[6px] pt-[24px]">
            <p className="text-white/80 text-[11px] font-medium text-center">
              LINE 친구들과 함께 더 많이 절약하세요
            </p>
            <div className="flex gap-[16px]">
              <span className="text-white/60 text-[10px]">👥 10만+ 사용자</span>
              <span className="text-white/60 text-[10px]">⭐ 평균 12% 할인</span>
              <span className="text-white/60 text-[10px]">🔒 100% 안전</span>
            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}