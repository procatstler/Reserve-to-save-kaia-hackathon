'use client';

import { Card } from '@/components/ui/Card';

interface ExpectedPaymentCardProps {
  currentAmount: number;
  targetAmount: number;
}

export default function ExpectedPaymentCard({ currentAmount, targetAmount }: ExpectedPaymentCardProps) {
  return (
    <Card className="bg-[#E8F5E9]">
      <h3 className="text-[#2E7D32] text-[16px] font-bold mb-[12px]">💡 예상 최종 결제액</h3>
      <div className="space-y-[8px]">
        <div className="flex justify-between items-center">
          <span className="text-[#000000] text-[14px] font-bold">현재 기준</span>
          <span className="text-[#DC3545] text-[18px] font-bold">{currentAmount.toFixed(2)} USDT</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#2E7D32] text-[12px]">목표 달성 시 최대</span>
          <span className="text-[#2E7D32] text-[16px] font-bold">{targetAmount.toFixed(2)} USDT</span>
        </div>
      </div>
    </Card>
  );
}