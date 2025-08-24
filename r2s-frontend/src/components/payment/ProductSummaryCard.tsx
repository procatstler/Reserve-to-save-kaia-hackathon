'use client';

import { Campaign } from '@/src/types';
import Badge from '@/src/components/ui/Badge';

interface ProductSummaryCardProps {
  campaign: Campaign & { quantity?: string };
}

export default function ProductSummaryCard({ campaign }: ProductSummaryCardProps) {
  return (
    <div className="h-full bg-white border border-[#E9ECEF] rounded-[16px] p-[12px] flex items-center gap-[12px]">
      <div className={`w-[44px] h-[44px] ${campaign.categoryColor || 'bg-[#8B4513]'} rounded-[10px] flex flex-col items-center justify-center`}>
        <span className="text-[12px] mb-[2px]">{campaign.categoryIcon}</span>
        <span className="text-white text-[8px]">{campaign.category}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-[#212529] text-[16px] font-bold">{campaign.title}</h3>
        <p className="text-[#6C757D] text-[13px]">{campaign.quantity || '1kg × 1개 주문'}</p>
      </div>
      <Badge variant="danger" size="sm">
        {campaign.discountPercent}% OFF
      </Badge>
    </div>
  );
}