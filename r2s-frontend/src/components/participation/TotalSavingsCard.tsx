'use client';

import { Card } from '@/src/components/ui/Card';

interface TotalSavingsCardProps {
  totalSavings: number;
  savingsRate: number;
  discountPercentage: number;
}

export default function TotalSavingsCard({ 
  totalSavings, 
  savingsRate, 
  discountPercentage 
}: TotalSavingsCardProps) {
  return (
    <Card className="bg-[#212529] h-full">
        <div className="flex justify-between items-start mb-[8px]">
          <span className="text-white text-[14px]">💰 총 할인 혜택</span>
          <span className="text-white text-[12px] opacity-90">누적 절약</span>
        </div>
        <div className="flex items-baseline gap-[8px]">
          <span className="text-white text-[30px] font-bold">{totalSavings.toFixed(2)}</span>
          <span className="text-white text-[18px] font-bold">USDT</span>
        </div>
        <div className="flex justify-between items-center mt-[8px]">
          <span className="text-white text-[12px] opacity-90">
            원가 대비 {discountPercentage}% 할인
          </span>
          <span className="text-white text-[12px] opacity-90">
            ⬆ +{savingsRate} USDT/시간
          </span>
        </div>
        <span className="text-white text-[11px] opacity-80">
          시간이 지날수록 더 많이 절약돼요!
        </span>
        
        <div className="absolute -bottom-[8px] right-[80px] bg-[#FFC107] text-white text-[9px] font-bold px-[8px] py-[3px] rounded-full animate-pulse">
          +0.3% 증가!
        </div>
    </Card>
  );
}