'use client';

import { Card } from '@/components/ui/Card';

interface ExpectedDiscountSectionProps {
  currentDiscount: number;
  currentDiscountAmount: number;
  additionalDiscountAmount: number;
  expectedFinalPrice: number;
}

export default function ExpectedDiscountSection({ 
  currentDiscount,
  currentDiscountAmount,
  additionalDiscountAmount,
  expectedFinalPrice
}: ExpectedDiscountSectionProps) {
  return (
    <Card className="bg-[#FFF9E6] h-full">
        <h3 className="text-[#212529] text-[18px] font-bold mb-[12px]">💰 예상 할인 혜택</h3>
        <div className="space-y-[8px]">
          <div className="flex justify-between items-center">
            <span className="text-[#6C757D] text-[14px]">현재 할인 ({currentDiscount}%)</span>
            <span className="text-[#DC3545] text-[16px] font-bold">-{currentDiscountAmount.toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6C757D] text-[14px]">추가 할인 가능성</span>
            <span className="text-[#28A745] text-[16px] font-bold">-{additionalDiscountAmount.toFixed(2)} USDT</span>
          </div>
          <div className="h-[1px] bg-[#FFE082]"></div>
          <div className="flex justify-between items-center">
            <span className="text-[#212529] text-[16px] font-bold">예상 최종 결제액</span>
            <span className="text-[#28A745] text-[20px] font-bold">{expectedFinalPrice.toFixed(2)} USDT</span>
          </div>
        </div>
    </Card>
  );
}