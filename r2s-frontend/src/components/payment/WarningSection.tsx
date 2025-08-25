'use client';

import { Card } from '@/components/ui/Card';

export default function WarningSection() {
  return (
    <Card className="bg-[#FFF3E0] h-full">
        <h3 className="text-[#F57C00] text-[14px] font-bold mb-[8px]">⚠️ 참여 전 확인사항</h3>
        <div className="space-y-[4px]">
          <p className="text-[#F57C00] text-[12px]">• 예치 후 캠페인 중도 취소 불가</p>
          <p className="text-[#F57C00] text-[12px]">• 최소 수량 미달성 시 자동 환불</p>
          <p className="text-[#F57C00] text-[12px]">• 결제는 마감 시점의 할인율로 정산</p>
        </div>
    </Card>
  );
}