'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/src/components/layout/PageLayout';
import CampaignCard from '@/src/components/campaign/CampaignCard';
import CampaignTabs from '@/src/components/campaign/CampaignTabs';
import Button from '@/src/components/ui/Button';
import { Campaign } from '@/src/types';
import { ROUTES, APP_NAME } from '@/src/constants';
import { mockCampaigns, getCampaignById } from '@/lib/mockData';

export default function CampaignListView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('전체');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate API call
    setCampaigns(mockCampaigns);
  }, [activeTab]);

  const handleCampaignClick = (campaignId: string) => {
    const campaign = getCampaignById(campaignId);
    if (campaign?.status === 'completed') {
      router.push(ROUTES.settlementComplete);
    } else {
      router.push(ROUTES.campaignDetail(campaignId));
    }
  };

  const handleLoadMore = () => {
    setLoading(true);
    // Simulate loading more campaigns
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <PageLayout
      header={{
        title: '캠페인 목록',
        variant: 'gradient',
        fixed: true,
        showClose: true
      }}
      showBottomNav
      activeNavItem="home"
      containerBackground="gray"
    >
      {/* Hero Section - 전체 너비 배경, 내용은 패딩 */}
      <div className="bg-gradient-to-b from-[#1DB954] to-[#1AA34A] -mt-[64px] pt-[80px] pb-[24px]">
        <div className="px-[20px]">
          <h1 className="text-white text-[24px] font-bold leading-[1.3]">
            기다린 만큼 할인되는
          </h1>
          <p className="text-white/90 text-[16px] mt-[6px]">
            공동구매 캠페인 🎯
          </p>
          
          {/* Stats Row */}
          <div className="flex gap-[16px] mt-[16px]">
            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-[12px] px-[12px] py-[10px]">
              <p className="text-white/80 text-[11px]">진행중 캠페인</p>
              <p className="text-white text-[18px] font-bold">{campaigns.filter(c => c.status === 'ongoing').length}개</p>
            </div>
            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-[12px] px-[12px] py-[10px]">
              <p className="text-white/80 text-[11px]">평균 할인율</p>
              <p className="text-white text-[18px] font-bold">12.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Section - 전체 너비 배경, 내용은 패딩 */}
      <div className="sticky top-[64px] z-30 bg-white border-b border-[#E9ECEF]">
        <div className="px-[20px] py-[12px]">
          <CampaignTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* Campaign Cards - 전체 너비 배경, 내용은 패딩 */}
      <div className="bg-[#F8F9FA] min-h-[calc(100vh-64px-56px)]">
        <div className="px-[20px] py-[20px]">
          <div className="space-y-[12px]">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onClick={() => handleCampaignClick(campaign.id)}
              />
            ))}
          </div>

          {/* Load More Button */}
          {campaigns.length > 0 && (
            <div className="mt-[24px]">
              <Button
                fullWidth
                variant="secondary"
                onClick={handleLoadMore}
                loading={loading}
                className="bg-white border border-[#DEE2E6] text-[#495057] hover:bg-gray-50"
              >
                {loading ? '로딩중...' : '더 많은 캠페인 보기 ↓'}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {campaigns.length === 0 && (
            <div className="text-center py-[60px]">
              <span className="text-[48px]">📦</span>
              <p className="text-[#6C757D] text-[14px] mt-[12px]">
                현재 진행중인 캠페인이 없습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}