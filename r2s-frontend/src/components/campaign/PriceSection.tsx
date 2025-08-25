'use client';

import { Card } from '@/components/ui/Card';
import { Campaign } from '@/types';
import { formatPrice } from '@/lib/utils';

interface PriceSectionProps {
  campaign: Campaign;
}

export default function PriceSection({ campaign }: PriceSectionProps) {
  const savings = campaign.originalPrice - campaign.discountedPrice;

  return (
    <Card variant="outlined" className="h-full">
        <div className="flex justify-between items-center mb-[8px]">
          <span className="text-[#6C757D] text-[14px]">원래 가격</span>
          <span className="text-[#6C757D] text-[16px] line-through">
            {formatPrice(campaign.originalPrice)}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-[8px]">
          <span className="text-[#212529] text-[16px] font-bold">현재 할인가</span>
          <span className="text-[#DC3545] text-[20px] font-bold">
            {formatPrice(campaign.discountedPrice)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[#28A745] text-[14px] font-bold">절약 금액</span>
          <span className="text-[#28A745] text-[16px] font-bold">
            {formatPrice(savings)}
          </span>
        </div>
    </Card>
  );
}