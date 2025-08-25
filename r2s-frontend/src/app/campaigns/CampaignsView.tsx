'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/PageLayout';
import R2SHeader from '@/components/common/R2SHeader';
import { mockApiService } from '@/services/mockApi';
import { CampaignStatus } from '@/types/campaign';
import { Campaign } from '@/types';

export default function CampaignsView() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns', statusFilter],
    queryFn: async () => {
      const params = {
        status: statusFilter === 'all' ? undefined : statusFilter,
        sort: 'latest'
      };
      return mockApiService.getCampaigns(params);
    }
  });

  return (
    <PageLayout containerBackground="white">
      <div className="flex flex-col min-h-screen">
        {/* 공통 R2S 헤더 */}
        <R2SHeader showClose />
        
        {/* 페이지 제목 영역 */}
        <section className="bg-gradient-to-br from-[#1DB954] to-[#1AA34A] pt-[44px]">
          <div className="px-[20px] py-[16px]">
            <h1 className="text-white text-[24px] font-bold leading-tight">기다린 만큼 할인되는</h1>
            <h2 className="text-white text-[16px] font-normal">공동구매 캠페인</h2>
          </div>
        </section>

        {/* 필터 탭 - 흰색 배경에 둥근 버튼들 */}
        <nav className="sticky top-[44px] z-30 bg-white border-b border-gray-100">
          <div className="flex items-center gap-[12px] px-[20px] py-[15px]">
            <FilterTab
              active={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            >
              전체
            </FilterTab>
            <FilterTab
              active={statusFilter === CampaignStatus.RECRUITING}
              onClick={() => setStatusFilter(CampaignStatus.RECRUITING)}
            >
              진행중
            </FilterTab>
            <FilterTab
              active={statusFilter === CampaignStatus.REACHED}
              onClick={() => setStatusFilter(CampaignStatus.REACHED)}
            >
              마감임박
            </FilterTab>
            <div className="flex-1"></div>
            <button className="text-[#1DB954] text-[14px] font-medium">할인율↓</button>
          </div>
        </nav>

        {/* 캠페인 목록 */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] pb-[80px]">
          <div className="px-[20px] py-[12px]">
            {isLoading ? (
              <div className="flex flex-col gap-[12px]">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-[120px] bg-white rounded-[16px] animate-pulse" />
                ))}
              </div>
            ) : campaigns && campaigns.length > 0 ? (
              <div className="flex flex-col gap-[12px]">
                {campaigns.map((campaign) => (
                  <CampaignListCard
                    key={campaign.id}
                    campaign={campaign}
                    onClick={() => router.push(`/campaign/${campaign.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-[#6C757D] text-[14px]">더 많은 캠페인 보기 ↓</p>
              </div>
            )}
          </div>
        </main>

        {/* 하단 네비게이션 */}
        <footer className="fixed bottom-0 left-0 right-0 h-[80px] bg-white border-t border-gray-200 z-40">
          <div className="flex items-center justify-around h-full px-[20px]">
            <NavButton active icon="🏠" label="홈" />
            <NavButton icon="📋" label="내 참여" onClick={() => router.push('/my-participation')} />
            <NavButton icon="📊" label="일반" />
            <NavButton icon="⋯" label="더보기" />
          </div>
        </footer>
      </div>
    </PageLayout>
  );
}

// 필터 탭 컴포넌트 - 이미지에 맞는 스타일
function FilterTab({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-[16px] py-[8px] rounded-full text-[14px] font-medium transition-colors ${
        active
          ? 'bg-[#1DB954] text-white'
          : 'bg-[#F0F0F0] text-[#666666] hover:bg-[#E0E0E0]'
      }`}
    >
      {children}
    </button>
  );
}

// 이미지에 맞는 캠페인 카드 디자인
function CampaignListCard({ 
  campaign, 
  onClick 
}: { 
  campaign: Campaign; 
  onClick: () => void;
}) {
  const isHot = campaign.badge === 'HOT';
  
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[16px] p-[16px] shadow-sm cursor-pointer relative"
    >
      {/* HOT 뱃지 */}
      {isHot && (
        <div className="absolute top-[12px] left-[12px] bg-[#FF4444] text-white text-[10px] font-bold px-[6px] py-[2px] rounded-[4px]">
          HOT
        </div>
      )}

      <div className="flex gap-[16px]">
        {/* 좌측 카테고리 아이콘 */}
        <div className="flex-shrink-0">
          <div className="w-[50px] h-[50px] bg-[#8B4513] rounded-[12px] flex items-center justify-center">
            <span className="text-[24px]">{campaign.categoryIcon}</span>
          </div>
          <div className="text-center text-[10px] text-[#666] mt-[4px]">
            {campaign.category}
          </div>
        </div>

        {/* 우측 정보 */}
        <div className="flex-1">
          {/* 제목 */}
          <h3 className="text-[16px] font-bold text-[#333] mb-[4px] pr-[60px]">
            {campaign.title}
          </h3>
          
          {/* 수량 정보 */}
          <p className="text-[12px] text-[#666] mb-[8px]">
            {campaign.quantity || campaign.description}
          </p>
          
          {/* 가격 정보 */}
          <div className="flex items-baseline gap-[8px] mb-[8px]">
            <span className="text-[14px] text-[#999] line-through">
              {campaign.originalPrice} USDT
            </span>
            <span className="text-[20px] font-bold text-[#E91E63]">
              {campaign.discountedPrice} USDT
            </span>
          </div>

          {/* 참여자 정보 */}
          <div className="flex justify-between items-center mb-[6px]">
            <span className="text-[11px] text-[#666]">
              참여 {campaign.currentParticipants}/{campaign.minParticipants}명
            </span>
          </div>
          
          {/* 진행률 바 */}
          <div className="w-full h-[4px] bg-[#E0E0E0] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1DB954] rounded-full transition-all duration-300"
              style={{ width: `${campaign.progress}%` }}
            />
          </div>
        </div>

        {/* 우측 상단 정보들 */}
        <div className="absolute top-[16px] right-[16px] text-right">
          {/* 할인율 */}
          <div className="bg-[#E91E63] text-white text-[10px] font-bold px-[6px] py-[2px] rounded-[4px] mb-[4px]">
            {campaign.discountPercent}%↗
          </div>
          {/* 시간 */}
          {campaign.timeRemaining && (
            <div className="bg-[#FFA500] text-white text-[10px] font-bold px-[6px] py-[2px] rounded-[4px]">
              {campaign.timeRemaining}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 하단 네비게이션 버튼
function NavButton({ 
  active = false,
  icon,
  label,
  onClick 
}: { 
  active?: boolean;
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-[4px] ${
        active ? 'text-[#1DB954]' : 'text-[#999999]'
      }`}
    >
      <span className="text-[20px]">{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}