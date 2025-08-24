'use client';

import { Card } from '@/src/components/ui/Card';

interface PaymentDetailsCardProps {
  depositAmount: number;
  discountAmount: number;
  finalAmount: number;
  transactionId: string;
  completedAt: string;
}

export default function PaymentDetailsCard({ 
  depositAmount,
  discountAmount,
  finalAmount,
  transactionId,
  completedAt
}: PaymentDetailsCardProps) {
  return (
    <Card variant="outlined" className="h-full">
        <div className="flex justify-between items-center mb-[12px]">
          <h3 className="text-[#212529] text-[18px] font-bold">💳 최종 결제 내역</h3>
          <span className="text-[#6C757D] text-[12px]">{completedAt}</span>
        </div>
        <div className="space-y-[10px]">
          <div className="flex justify-between items-center py-[8px] border-b border-[#E9ECEF]">
            <span className="text-[#6C757D] text-[14px]">예치 금액</span>
            <span className="text-[#6C757D] text-[16px]">{depositAmount.toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#DC3545] text-[14px] font-bold">할인 혜택</span>
            <span className="text-[#DC3545] text-[16px] font-bold">-{discountAmount.toFixed(2)} USDT</span>
          </div>
          <div className="h-[1px] bg-[#DEE2E6]"></div>
          <div className="flex justify-between items-center">
            <span className="text-[#212529] text-[16px] font-bold">실제 결제액</span>
            <span className="text-[#28A745] text-[20px] font-bold">{finalAmount.toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#28A745] text-[12px] font-bold">✓ 결제 완료</span>
            <span className="text-[#6C757D] text-[11px]">TX: {transactionId}</span>
          </div>
        </div>
    </Card>
  );
}