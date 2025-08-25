'use client';

import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { Campaign } from '@/types';

interface DiscountSectionProps {
  campaign: Campaign;
}

export default function DiscountSection({ campaign }: DiscountSectionProps) {
  const discountProgress = (campaign.discountPercent / (campaign.targetDiscount || 15)) * 100;

  return (
    <Card className="bg-[#FFF9E6] h-full">
        <div className="flex justify-between items-start mb-[8px]">
          <h3 className="text-[#212529] text-[18px] font-bold">현재 할인율</h3>
          <span className="text-[#6C757D] text-[12px]">실시간 업데이트 •</span>
        </div>
        
        <div className="flex justify-center items-center">
          <span className="text-[#DC3545] text-[48px] font-bold">
            {campaign.discountPercent}%
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[#6C757D] text-[12px]">
            목표: {campaign.targetDiscount || 15}%
          </span>
          <Badge variant="success" size="md">
            ⬆ +{campaign.discountRate || 0.3}%/시간
          </Badge>
        </div>
        
        <ProgressBar 
          value={discountProgress}
          variant="warning"
          className="mt-[8px]"
        />
    </Card>
  );
}