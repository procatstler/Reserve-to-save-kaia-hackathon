'use client';

import { Card } from '@/src/components/ui/Card';
import { Campaign } from '@/src/types';

interface ParticipationStatusProps {
  campaign: Campaign;
}

export default function ParticipationStatus({ campaign }: ParticipationStatusProps) {
  return (
    <Card variant="outlined" className="h-full">
        <h3 className="text-[#212529] text-[16px] font-bold mb-[12px]">
          참여 현황
        </h3>
        
        <div className="flex justify-between items-center">
          {/* Achievement Rate */}
          <div className="flex flex-col items-center">
            <div className="w-[45px] h-[45px] bg-[#28A745] rounded-full flex items-center justify-center">
              <span className="text-white text-[16px] font-bold">
                {campaign.progress}%
              </span>
            </div>
            <span className="text-[#6C757D] text-[10px] mt-[4px]">달성률</span>
          </div>
          
          {/* Current Participants */}
          <div className="flex flex-col items-center">
            <div className="w-[100px] h-[45px] bg-[#E8F5E9] rounded-[12px] flex items-center justify-center">
              <span className="text-[#00C73C] text-[24px] font-bold">
                {campaign.currentParticipants}
              </span>
            </div>
            <span className="text-[#6C757D] text-[12px] mt-[4px]">현재 참여자</span>
          </div>
          
          <span className="text-[#6C757D] text-[14px] self-center">/</span>
          
          {/* Target Participants */}
          <div className="flex flex-col items-center">
            <div className="w-[100px] h-[45px] bg-[#F8F9FA] rounded-[12px] flex items-center justify-center">
              <span className="text-[#212529] text-[24px] font-bold">
                {campaign.minParticipants}
              </span>
            </div>
            <span className="text-[#6C757D] text-[12px] mt-[4px]">목표 수량</span>
          </div>
        </div>
    </Card>
  );
}