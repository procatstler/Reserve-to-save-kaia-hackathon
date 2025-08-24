'use client';

import Badge from '@/src/components/ui/Badge';

interface CompletedCampaignCardProps {
  campaign: {
    id: string;
    category: string;
    categoryIcon: string;
    title: string;
    quantity: string;
    savedAmount: number;
    completedDate: string;
  };
  onClick?: (campaignId: string) => void;
}

export default function CompletedCampaignCard({ campaign, onClick }: CompletedCampaignCardProps) {
  return (
    <div 
      onClick={() => onClick?.(campaign.id)}
      className="bg-white border border-[#E9ECEF] rounded-[16px] p-[12px] mb-[12px] flex items-center gap-[12px] cursor-pointer hover:shadow-sm transition-shadow"
    >
      <div className="w-[40px] h-[40px] bg-[#4169E1] rounded-[10px] flex flex-col items-center justify-center">
        <span className="text-[10px]">{campaign.categoryIcon}</span>
        <span className="text-white text-[7px]">{campaign.category}</span>
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[#212529] text-[14px] font-bold">{campaign.title}</h3>
            <p className="text-[#6C757D] text-[12px]">{campaign.quantity}</p>
          </div>
          <Badge variant="secondary" size="sm">완료</Badge>
        </div>
        <div className="flex justify-between items-center mt-[6px]">
          <span className="text-[#28A745] text-[12px] font-bold">
            {campaign.savedAmount} USDT 절약
          </span>
          <span className="text-[#6C757D] text-[11px]">{campaign.completedDate}</span>
        </div>
      </div>
    </div>
  );
}