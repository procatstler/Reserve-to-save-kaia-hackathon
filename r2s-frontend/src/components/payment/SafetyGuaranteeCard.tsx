'use client';

import { Card } from '@/components/ui/Card';

export default function SafetyGuaranteeCard() {
  return (
    <Card className="bg-[#E8F5E9] h-full">
        <h3 className="text-[#2E7D32] text-[16px] font-bold mb-[10px]">🛡️ 100% 안전 보장</h3>
        <div className="space-y-[6px]">
          <p className="text-[#2E7D32] text-[13px]">✓ 스마트 컨트랙트로 자동 관리</p>
          <p className="text-[#2E7D32] text-[13px]">✓ 캠페인 실패 시 전액 환불</p>
          <p className="text-[#2E7D32] text-[13px]">✓ Kaia 블록체인에서 투명하게 보관</p>
        </div>
    </Card>
  );
}