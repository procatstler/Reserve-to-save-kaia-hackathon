'use client';

import { cn } from '@/src/lib/utils';
import { CAMPAIGN_TABS } from '@/src/constants';

interface CampaignTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export default function CampaignTabs({ 
  activeTab, 
  onTabChange,
  className 
}: CampaignTabsProps) {
  return (
    <div className={cn(
      'flex gap-[8px] overflow-x-auto scrollbar-hide',
      className
    )}>
      {CAMPAIGN_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            'px-[18px] py-[9px] rounded-full text-[13px] font-medium',
            'transition-all duration-200 whitespace-nowrap',
            'border',
            activeTab === tab
              ? 'bg-[#1DB954] text-white border-[#1DB954] shadow-sm'
              : 'bg-white text-[#6C757D] border-[#DEE2E6] hover:border-[#1DB954] hover:text-[#1DB954]'
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}