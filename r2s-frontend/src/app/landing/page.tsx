'use client';

import Link from 'next/link';
import PageLayout from '@/src/components/layout/PageLayout';
import HeroSection from '@/src/components/landing/HeroSection';
import FeatureCard from '@/src/components/landing/FeatureCard';
import ExampleCard from '@/src/components/landing/ExampleCard';
import Button from '@/src/components/ui/Button';
import { ROUTES, APP_NAME } from '@/src/constants';

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
    <PageLayout
      header={{
        title: APP_NAME,
        variant: 'gradient',
        fixed: true,
        showClose: true
      }}
      containerBackground="gradient"
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Feature Cards Section with proper padding */}
      <div className="absolute top-[39%] left-[20px] right-[20px] sm:left-[24px] sm:right-[24px] h-[27%]">
        <div className="flex flex-col gap-[12px] h-full">
          {features.map((feature, index) => (
            <div key={index} className="flex-1">
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>

      {/* Example Card with padding */}
      <div className="absolute top-[68%] left-[20px] right-[20px] sm:left-[24px] sm:right-[24px] h-[10%]">
        <ExampleCard />
      </div>

      {/* CTA Button with padding */}
      <div className="absolute top-[80%] left-[20px] right-[20px] sm:left-[24px] sm:right-[24px] h-[8%]">
        <Link href={ROUTES.campaigns} className="block w-full h-full">
          <Button 
            fullWidth
            variant="primary"
            size="xl"
            className="h-full bg-white text-[#1DB954] hover:bg-white/95 font-bold shadow-xl rounded-[12px] text-[16px]"
          >
            지금 시작하기 →
          </Button>
        </Link>
      </div>

      {/* Footer with padding */}
      <div className="absolute top-[90%] left-[20px] right-[20px] bottom-[10px]">
        <div className="flex flex-col items-center gap-[6px]">
          <p className="text-white/80 text-[11px] font-medium">
            LINE 친구들과 함께 더 많이 절약하세요
          </p>
          <div className="flex gap-[16px]">
            <span className="text-white/60 text-[10px]">👥 10만+ 사용자</span>
            <span className="text-white/60 text-[10px]">⭐ 평균 12% 할인</span>
            <span className="text-white/60 text-[10px]">🔒 100% 안전</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}