'use client';

import { Campaign } from '@/types';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatPrice } from '@/lib/utils';

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
}

export default function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  return (
    <Card 
      variant="elevated"
      onClick={onClick}
      className="relative bg-white hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      {/* Badge */}
      {campaign.badge && (
        <div className="absolute top-[12px] right-[12px] z-10">
          <Badge variant="danger" size="sm" className="shadow-sm">
            {campaign.badge}
          </Badge>
        </div>
      )}

      {/* Content */}
      <div className="flex gap-[14px]">
        {/* Category Icon */}
        <div className={`w-[64px] h-[64px] ${campaign.categoryColor || 'bg-gradient-to-br from-[#1DB954] to-[#1AA34A]'} rounded-[14px] flex flex-col items-center justify-center shadow-sm flex-shrink-0`}>
          <span className="text-[24px] mb-[2px]">{campaign.categoryIcon}</span>
          <span className="text-white text-[10px] font-semibold">{campaign.category}</span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[#212529] text-[15px] font-bold mb-[6px] truncate pr-[60px]">
            {campaign.title}
          </h3>
          
          {campaign.description && (
            <p className="text-[#6C757D] text-[12px] mb-[10px] line-clamp-1">
              {campaign.description}
            </p>
          )}
          
          {/* Price Row */}
          <div className="flex items-center gap-[8px] mb-[10px] flex-wrap">
            <span className="text-[#ADB5BD] text-[12px] line-through">
              {formatPrice(campaign.originalPrice)}
            </span>
            <span className="text-[#1DB954] text-[18px] font-bold">
              {formatPrice(campaign.discountedPrice)}
            </span>
            <Badge variant="success" size="sm" className="font-bold">
              {campaign.discountPercent}% ↓
            </Badge>
          </div>

          {/* Progress Section */}
          <div className="space-y-[6px]">
            {/* Progress Bar */}
            <ProgressBar 
              value={campaign.progress} 
              className="h-[6px]"
              color="gradient"
            />
            
            {/* Progress Info Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <span className="text-[#6C757D] text-[11px]">
                  참여 {campaign.currentParticipants}/{campaign.minParticipants}명
                </span>
                <span className="text-[#DEE2E6]">•</span>
                <span className="text-[#1DB954] text-[11px] font-semibold">
                  {campaign.progress}%
                </span>
              </div>
              
              {/* Time Badge */}
              {campaign.timeRemaining && (
                <Badge variant="warning" size="sm" className="font-medium">
                  ⏰ {campaign.timeRemaining}
                </Badge>
              )}
              
              {campaign.status === 'completed' && (
                <Badge variant="success" size="sm">
                  ✓ 정산완료
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}