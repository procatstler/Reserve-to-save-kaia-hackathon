'use client';

import { Card } from '@/src/components/ui/Card';

interface DepositAmountSectionProps {
  originalPrice: number;
  depositAmount: number;
}

export default function DepositAmountSection({ originalPrice, depositAmount }: DepositAmountSectionProps) {
  return (
    <Card variant="outlined" className="h-full">
        <div className="flex justify-between items-center mb-[4px]">
          <h3 className="text-[#212529] text-[18px] font-bold">🔒 예치 금액</h3>
          <span className="text-[#6C757D] text-[12px]">안전하게 보관</span>
        </div>
        <div className="bg-[#F8F9FA] rounded-[12px] p-[12px] mt-[10px]">
          <div className="flex justify-between items-center mb-[8px]">
            <span className="text-[#6C757D] text-[12px]">상품 정가</span>
            <span className="text-[#6C757D] text-[12px]">{originalPrice.toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#212529] text-[16px] font-bold">예치할 금액</span>
            <span className="text-[#212529] text-[16px] font-bold">{depositAmount.toFixed(2)} USDT</span>
          </div>
        </div>
        <div className="bg-[#E3F2FD] rounded-[8px] p-[8px] mt-[8px]">
          <span className="text-[#1976D2] text-[12px]">💡 정가로 예치하고, 할인된 금액만 최종 결제됩니다</span>
        </div>
    </Card>
  );
}