'use client';

import { Card } from '@/src/components/ui/Card';

interface CampaignSummaryCardProps {
  totalParticipants: number;
  waitingTime: string;
  successRate: number;
}

export default function CampaignSummaryCard({ 
  totalParticipants,
  waitingTime,
  successRate
}: CampaignSummaryCardProps) {
  return (
    <Card className="bg-[#F8F9FA] h-full">
        <h3 className="text-[#212529] text-[16px] font-bold mb-[12px]">📊 캠페인 성과 요약</h3>
        <div className="flex justify-between">
          <div className="flex-1 text-center">
            <div className="w-[75px] h-[48px] bg-white rounded-[12px] flex items-center justify-center mx-auto mb-[6px]">
              <span className="text-[#28A745] text-[18px] font-bold">{totalParticipants}명</span>
            </div>
            <span className="text-[#6C757D] text-[11px]">총 참여자</span>
          </div>
          <div className="flex-1 text-center">
            <div className="w-[75px] h-[48px] bg-white rounded-[12px] flex items-center justify-center mx-auto mb-[6px]">
              <span className="text-[#FF6B6B] text-[18px] font-bold">{waitingTime}</span>
            </div>
            <span className="text-[#6C757D] text-[11px]">대기 시간</span>
          </div>
          <div className="flex-1 text-center">
            <div className="w-[75px] h-[48px] bg-white rounded-[12px] flex items-center justify-center mx-auto mb-[6px]">
              <span className="text-[#4A90E2] text-[18px] font-bold">{successRate}%</span>
            </div>
            <span className="text-[#6C757D] text-[11px]">성공률</span>
          </div>
        </div>
    </Card>
  );
}