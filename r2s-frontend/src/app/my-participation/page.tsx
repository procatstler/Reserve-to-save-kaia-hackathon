'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { mockApiService } from '@/services/mockApi';
import { ParticipationStatus } from '@/types/participation';
import { formatUSDT, formatDate } from '@/utils/format';
import { useRouter } from 'next/navigation';
import WalletButton from '@/components/Wallet/WalletButton';

export default function MyParticipationPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<ParticipationStatus | 'all'>('all');
  
  // Mock user ID (실제로는 LIFF 프로필에서 가져와야 함)
  const userId = 'user123';

  const { data: participations, isLoading } = useQuery({
    queryKey: ['participations', userId, statusFilter],
    queryFn: async () => {
      return mockApiService.getUserParticipations(
        userId,
        statusFilter === 'all' ? undefined : statusFilter
      );
    }
  });

  const handleCancelParticipation = async (participationId: string) => {
    const confirmed = confirm('정말로 참여를 취소하시겠습니까? 예치금이 환불됩니다.');
    if (confirmed) {
      try {
        await mockApiService.cancelParticipation(participationId, userId);
        // 리프레시
        window.location.reload();
      } catch (error) {
        alert('취소 처리 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold">나의 참여 내역</h1>
            </div>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* 통계 카드 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="총 참여 캠페인"
            value={participations?.length || 0}
            unit="개"
            color="blue"
          />
          <StatCard
            title="예치 중인 금액"
            value={formatUSDT(
              participations
                ?.filter(p => p.status === ParticipationStatus.ACTIVE)
                .reduce((sum, p) => sum + Number(p.depositAmount), 0)
                .toString() || '0'
            )}
            unit="USDT"
            color="green"
          />
          <StatCard
            title="누적 리베이트"
            value={formatUSDT(
              participations
                ?.filter(p => p.actualRebate)
                .reduce((sum, p) => sum + Number(p.actualRebate), 0)
                .toString() || '0'
            )}
            unit="USDT"
            color="purple"
          />
        </div>

        {/* 필터 탭 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <TabButton
              active={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            >
              전체
            </TabButton>
            <TabButton
              active={statusFilter === ParticipationStatus.ACTIVE}
              onClick={() => setStatusFilter(ParticipationStatus.ACTIVE)}
            >
              진행중
            </TabButton>
            <TabButton
              active={statusFilter === ParticipationStatus.SETTLED}
              onClick={() => setStatusFilter(ParticipationStatus.SETTLED)}
            >
              정산완료
            </TabButton>
            <TabButton
              active={statusFilter === ParticipationStatus.CANCELLED}
              onClick={() => setStatusFilter(ParticipationStatus.CANCELLED)}
            >
              취소됨
            </TabButton>
          </div>
        </div>

        {/* 참여 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
              ))}
            </div>
          ) : participations && participations.length > 0 ? (
            participations.map((participation) => (
              <ParticipationCard
                key={participation.id}
                participation={participation}
                onCancel={() => handleCancelParticipation(participation.id)}
                router={router}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">참여 내역이 없습니다.</p>
              <button
                onClick={() => router.push('/campaigns')}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                캠페인 둘러보기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 통계 카드 컴포넌트
function StatCard({ 
  title, 
  value, 
  unit, 
  color 
}: { 
  title: string; 
  value: string | number; 
  unit: string; 
  color: 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
      <p className="text-sm opacity-80 mb-1">{title}</p>
      <p className="text-2xl font-bold">
        {value} <span className="text-sm font-normal">{unit}</span>
      </p>
    </div>
  );
}

// 탭 버튼 컴포넌트
function TabButton({ 
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
      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

// 참여 카드 컴포넌트
function ParticipationCard({ 
  participation, 
  onCancel,
  router
}: { 
  participation: any; 
  onCancel: () => void;
  router: any;
}) {
  const getStatusBadge = () => {
    switch (participation.status) {
      case ParticipationStatus.ACTIVE:
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">진행중</span>;
      case ParticipationStatus.SETTLED:
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">정산완료</span>;
      case ParticipationStatus.CANCELLED:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">취소됨</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg mb-1">{participation.campaignTitle}</h3>
          <p className="text-sm text-gray-500">참여일: {formatDate(participation.joinedAt)}</p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">예치금액</p>
          <p className="font-medium">{formatUSDT(participation.depositAmount)} USDT</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">예상 리베이트</p>
          <p className="font-medium text-green-600">
            {formatUSDT(participation.expectedRebate)} USDT
          </p>
        </div>
        {participation.actualRebate && (
          <div>
            <p className="text-xs text-gray-500">실제 리베이트</p>
            <p className="font-medium text-green-600">
              {formatUSDT(participation.actualRebate)} USDT
            </p>
          </div>
        )}
        {participation.refundedAmount && (
          <div>
            <p className="text-xs text-gray-500">환불금액</p>
            <p className="font-medium">{formatUSDT(participation.refundedAmount)} USDT</p>
          </div>
        )}
      </div>

      {participation.status === ParticipationStatus.ACTIVE && (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/campaign/${participation.campaignId}`)}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            캠페인 상세
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            참여 취소
          </button>
        </div>
      )}

      {participation.settlementTxHash && (
        <div className="mt-3 p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">정산 트랜잭션</p>
          <p className="text-xs font-mono break-all">{participation.settlementTxHash}</p>
        </div>
      )}
    </div>
  );
}