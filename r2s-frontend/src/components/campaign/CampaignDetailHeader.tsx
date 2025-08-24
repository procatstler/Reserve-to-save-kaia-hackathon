'use client';

import Badge from '@/src/components/ui/Badge';
import { Campaign } from '@/src/types';

interface CampaignDetailHeaderProps {
  campaign: Campaign;
}

export default function CampaignDetailHeader({ campaign }: CampaignDetailHeaderProps) {
  return (
    <div className="bg-[#00C73C] rounded-full h-full flex items-center justify-center">
      <span className="text-white text-[12px]">
        🔥 현재 {campaign.currentParticipants}명 참여중 • {campaign.minParticipants - campaign.currentParticipants}명만 더 참여하면 성공!
      </span>
    </div>
  );
}