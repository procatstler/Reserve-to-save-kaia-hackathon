'use client';

import { Campaign } from '@/types';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

interface OngoingCampaignCardProps {
  campaign: Campaign & {
    quantity?: string;
    depositAmount?: number;
    currentSavings?: number;
  };
  onClick: (campaignId: string) => void;
}

export default function OngoingCampaignCard({ campaign, onClick }: OngoingCampaignCardProps) {
  const progressPercentage = campaign.currentParticipants / campaign.minParticipants * 100;

  return (
    <div 
      onClick={() => onClick(campaign.id)}
      className="bg-white border border-[#E9ECEF] rounded-[16px] p-[16px] mb-[12px] cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-[12px]">
        <div className="w-[60px] h-[60px] bg-[#8B4513] rounded-[12px] flex flex-col items-center justify-center">
          <span className="text-[14px] mb-[2px]">{campaign.categoryIcon}</span>
          <span className="text-white text-[9px]">{campaign.category}</span>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-[4px]">
            <h3 className="text-[#212529] text-[16px] font-bold">{campaign.title}</h3>
            <Badge variant="success" size="sm">참여중</Badge>
          </div>
          <p className="text-[#6C757D] text-[13px] mb-[8px]">{campaign.quantity}</p>
          
          <div className="border-t border-[#E9ECEF] pt-[8px] space-y-[4px]">
            <div className="flex justify-between items-center">
              <span className="text-[#6C757D] text-[12px]">현재 할인율</span>
              <span className="text-[#DC3545] text-[18px] font-bold">{campaign.discountPercent}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6C757D] text-[12px]">예치 금액</span>
              <span className="text-[#212529] text-[14px] font-bold">
                {campaign.depositAmount?.toFixed(2) || campaign.originalPrice.toFixed(2)} USDT
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#28A745] text-[12px] font-bold">현재 절약</span>
              <span className="text-[#28A745] text-[14px] font-bold">
                {campaign.currentSavings?.toFixed(2) || (campaign.originalPrice - campaign.discountedPrice).toFixed(2)} USDT
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-[8px] pt-[8px] border-t border-[#E9ECEF]">
            <span className="text-[#6C757D] text-[12px]">
              참여자 {campaign.currentParticipants}/{campaign.minParticipants}명 ({Math.round(progressPercentage)}%)
            </span>
            <span className="text-[#856404] text-[12px] font-bold">⏰ {campaign.timeRemaining}</span>
          </div>
          
          <ProgressBar 
            value={progressPercentage}
            variant="warning"
            className="mt-[8px]"
          />
        </div>
      </div>
    </div>
  );
}