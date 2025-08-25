'use client';

import { Card } from '@/components/ui/Card';

interface FinalDiscountCardProps {
  finalDiscountAmount: number;
  finalDiscount: number;
  achievedRate: number;
  totalParticipants: number;
}

export default function FinalDiscountCard({ 
  finalDiscountAmount,
  finalDiscount,
  achievedRate,
  totalParticipants
}: FinalDiscountCardProps) {
  return (
    <Card className="bg-[#212529] h-full">
        <div className="flex justify-between items-start mb-[8px]">
          <span className="text-white text-[16px] font-bold">🏆 최종 할인 혜택</span>
          <span className="text-white text-[12px] opacity-90">목표 달성!</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-[8px]">
              <span className="text-white text-[35px] font-bold">{finalDiscountAmount.toFixed(2)}</span>
              <span className="text-white text-[20px] font-bold">USDT</span>
            </div>
            <p className="text-white text-[14px] opacity-90 mt-[4px]">
              원가 100 USDT에서 {finalDiscount}% 할인
            </p>
            <p className="text-white text-[12px] opacity-80">3일 동안 기다린 보상입니다!</p>
          </div>
          <div className="text-right">
            <span className="text-white text-[24px] font-bold">{achievedRate}%</span>
            <p className="text-white text-[12px] opacity-80">참여자 {totalParticipants}명 달성</p>
          </div>
        </div>
    </Card>
  );
}